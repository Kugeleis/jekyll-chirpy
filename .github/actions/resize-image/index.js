/**
 * index.js
 * Node 18 compatible. Run with: node index.js '<github_event_json>'
 *
 * Behaviour:
 * - Parses incoming GitHub event JSON from the workflow invocation
 * - Finds issue or comment text to process
 * - Downloads allowlisted images, converts to WebP, resizes to MAX_WIDTH and QUALITY
 * - Commits converted files into TARGET_OWNER/TARGET_REPO under assets/<issue-number>/
 * - Updates the issue body or comment body to replace remote URLs with raw.githubusercontent URLs
 *
 * Environment variables required:
 * - GITHUB_TOKEN (provided by workflow)
 * - TARGET_OWNER (e.g., user-attachments)
 * - TARGET_REPO (e.g., assets)
 * - MAX_WIDTH (default 1200)
 * - QUALITY (default 80)
 */

import fs from 'fs';
import path from 'path';
import { Octokit } from '@octokit/rest';
import fetch from 'node-fetch';
import sharp from 'sharp';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';
import { toMarkdown } from 'mdast-util-to-markdown';

const eventFile = process.argv[2] || 'event.json';
let event;
try {
  const eventJson = fs.readFileSync(eventFile, 'utf8');
  event = JSON.parse(eventJson);
} catch (err) {
  console.error('Error reading event file:', err.message);
  process.exit(1);
}

const githubToken = process.env.GITHUB_TOKEN;
const targetOwner = process.env.TARGET_OWNER || 'user-attachments';
const targetRepo = process.env.TARGET_REPO || 'assets';
const maxWidth = parseInt(process.env.MAX_WIDTH || '1200', 10);
const quality = parseInt(process.env.QUALITY || '80', 10);

if (!githubToken) {
  console.error('GITHUB_TOKEN required');
  process.exit(1);
}

const octokit = new Octokit({ auth: githubToken });

// Helper: allowlist GitHub-hosted domains
const ALLOWED_HOSTNAMES = new Set([
  'user-images.githubusercontent.com',
  'raw.githubusercontent.com',
  'github.com',
  'camo.githubusercontent.com'
]);

function getTextAndTarget(event) {
  // Returns object: { owner, repo, issue_number, type, id, text, patchCallback }
  // type: 'issue' or 'comment'
  // patchCallback(newText): function that applies the update via octokit
  const repo_full = event.repository?.full_name || process.env.GITHUB_REPOSITORY;
  if (!repo_full) throw new Error('Repository context not found');

  const [owner, repo] = repo_full.split('/');

  // Issue body (opened/edited)
  if (event.issue && event.action && (event.action === 'opened' || event.action === 'edited')) {
    const issue_number = event.issue.number;
    const original = event.issue.body || '';
    return {
      owner, repo, issue_number,
      type: 'issue',
      id: issue_number,
      text: original,
      async patchCallback(newText) {
        await octokit.issues.update({
          owner, repo, issue_number, body: newText
        });
      }
    };
  }

  // Issue comment (created/edited)
  if (event.comment && (event.action === 'created' || event.action === 'edited' || event.action === undefined)) {
    const comment_id = event.comment.id;
    const original = event.comment.body || '';
    return {
      owner, repo,
      type: 'comment',
      id: comment_id,
      text: original,
      async patchCallback(newText) {
        await octokit.issues.updateComment({
          owner, repo, comment_id, body: newText
        });
      }
    };
  }

  throw new Error('No issue or comment payload to process');
}

async function findImageNodes(markdown) {
  const tree = unified().use(remarkParse).parse(markdown);
  const images = [];
  visit(tree, 'image', node => {
    images.push({ node, url: node.url, alt: node.alt, title: node.title });
  });
  return { tree, images };
}

function isAllowedUrl(u) {
  try {
    const url = new URL(u);
    return ALLOWED_HOSTNAMES.has(url.hostname);
  } catch {
    return false;
  }
}

async function downloadBuffer(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'github-action-resize-images' }
  });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return await res.buffer();
}

// Commit file to target repo using createOrUpdateFileContents
async function commitBufferToTargetRepo(filePath, buffer, message) {
  const base64 = buffer.toString('base64');

  // check if file exists to get sha
  let sha = undefined;
  try {
    const { data } = await octokit.repos.getContent({
      owner: targetOwner, repo: targetRepo, path: filePath
    });
    sha = data.sha;
  } catch (err) {
    // not found -> will create
  }

  await octokit.repos.createOrUpdateFileContents({
    owner: targetOwner,
    repo: targetRepo,
    path: filePath,
    message,
    content: base64,
    sha,
    committer: { name: 'github-actions', email: 'actions@github.com' },
    author: { name: 'github-actions', email: 'actions@github.com' }
  });

  // raw file URL uses main branch by default; if target repo default branch isn't main, consider using the branch field
  return `https://raw.githubusercontent.com/${targetOwner}/${targetRepo}/main/${filePath}`;
}

function sanitizeFilename(name) {
  return name.replace(/[^\w.\-]/g, '_').slice(0, 180);
}

(async () => {
  try {
    const ctx = getTextAndTarget(event);
    if (!ctx || !ctx.text) {
      console.log('No text to process.');
      return;
    }

    const { tree, images } = await findImageNodes(ctx.text);
    if (!images.length) {
      console.log('No images found in text.');
      return;
    }

    const replacements = {}; // originalUrl -> newUrl

    for (const { node, url } of images) {
      if (!isAllowedUrl(url)) {
        console.log('Skipping non-allowed host:', url);
        continue;
      }

      try {
        console.log('Processing:', url);
        const buf = await downloadBuffer(url);

        // Use sharp to resize and convert to webp
        const img = sharp(buf);
        const metadata = await img.metadata();

        let pipeline = img;
        if (metadata.width && metadata.width > maxWidth) {
          pipeline = pipeline.resize({ width: maxWidth });
        }
        pipeline = pipeline.webp({ quality });

        const outBuf = await pipeline.toBuffer();

        // Prepare path: assets/<issue-number>/<timestamp>-<origname>.webp
        const issueNumber = ctx.issue_number || (event.issue && event.issue.number) || (event.comment && event.issue && event.issue.number) || 'unknown';
        const baseName = path.posix.basename(new URL(url).pathname || 'image');
        const safe = sanitizeFilename(baseName);
        const filename = `${Date.now()}-${safe}.webp`;
        const filePath = `assets/${issueNumber}/${filename}`;
        const commitMsg = `Add resized image for issue #${issueNumber}`;

        const rawUrl = await commitBufferToTargetRepo(filePath, outBuf, commitMsg);
        replacements[url] = rawUrl;

        console.log('Committed to', rawUrl);
      } catch (err) {
        console.error('Error processing', url, err.message || err);
      }
    }

    if (Object.keys(replacements).length === 0) {
      console.log('No replacements generated.');
      return;
    }

    // Replace URLs in AST image nodes
    visit(tree, 'image', node => {
      if (replacements[node.url]) {
        node.url = replacements[node.url];
      }
    });

    // Serialize back to markdown
    const newText = toMarkdown(tree);

    if (newText !== ctx.text) {
      await ctx.patchCallback(newText);
      console.log('Updated original with resized image URLs.');
    } else {
      console.log('No change to text after replacements.');
    }
  } catch (err) {
    console.error('Fatal:', err);
    process.exit(1);
  }
})();
