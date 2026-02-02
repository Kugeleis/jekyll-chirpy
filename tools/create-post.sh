#!/bin/bash

# Extract info from issue
TITLE="$ISSUE_TITLE"
BODY="$ISSUE_BODY"

# Extract tags
TAG_LINE=$(printf '%s' "$BODY" | grep -iE '^(tag|tags):' | head -n 1)
if [ -n "$TAG_LINE" ]; then
  TAGS=$(printf '%s' "$TAG_LINE" | sed -E 's/^(tag|tags)://i' | tr -d '\r' | sed 's/^ *//;s/ *$//')
  BODY=$(printf '%s' "$BODY" | grep -vFx "$TAG_LINE")
else
  TAGS=""
fi

# Extract categories
CAT_LINE=$(printf '%s' "$BODY" | grep -iE '^(category|categories):' | head -n 1)
if [ -n "$CAT_LINE" ]; then
  CATEGORIES=$(printf '%s' "$CAT_LINE" | sed -E 's/^(category|categories)://i' | tr -d '\r' | sed 's/^ *//;s/ *$//')
  BODY=$(printf '%s' "$BODY" | grep -vFx "$CAT_LINE")
else
  CATEGORIES=""
fi

# Create filename-friendly slug
# Normalize German Umlaute
SLUG=$(printf '%s' "$TITLE" | sed 's/ä/ae/g; s/ö/oe/g; s/ü/ue/g; s/Ä/ae/g; s/Ö/oe/g; s/Ü/ue/g; s/ß/ss/g')
SLUG=$(printf '%s' "$SLUG" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -dc 'a-z0-9-')
# Remove multiple hyphens
SLUG=$(printf '%s' "$SLUG" | sed 's/-\{2,\}/-/g')

DATE=$(date +%Y-%m-%d)

# Process images
# Find GitHub asset URLs
IMAGES=$(printf '%s' "$BODY" | grep -oE 'https://github.com/[^/]+/[^/]+/assets/[0-9a-fA-F-]+(/[0-9a-fA-F-]+)?|https://github.com/user-attachments/assets/[0-9a-fA-F-]+' | sort -u)

# Continue with further processing
# Create post file with front matter
mkdir -p "_posts"

# Write front matter and content
POST_DATE=$(date +"%Y-%m-%d %H:%M:%S %z")
{
  printf '%s\n' '---'
  printf 'title: "%s"\n' "$TITLE"
  printf 'date: %s\n' "$POST_DATE"
  if [ -n "$CATEGORIES" ]; then
    printf 'categories: [%s]\n' "$CATEGORIES"
  fi
  if [ -n "$TAGS" ]; then
    printf 'tags: [%s]\n' "$TAGS"
  fi
  printf '%s\n\n' '---'
  printf '%s\n' "$BODY"
} > "_posts/$DATE-$SLUG.md"

# Configure git
git config --local user.email "action@github.com"
git config --local user.name "GitHub Action"

# Commit and push
git add "_posts/$DATE-$SLUG.md"
if [ -d "assets/img/posts/$SLUG" ]; then
  git add "assets/img/posts/$SLUG"
fi
git commit -m "Add new post: $TITLE"
git push

# Get site URL and baseurl from _config.yml
SITE_URL=$(grep "^url:" _config.yml | sed 's/url: *//' | tr -d '"' | tr -d "'" | sed 's/ *#.*$//')
BASE_URL=$(grep "^baseurl:" _config.yml | sed 's/baseurl: *//' | tr -d '"' | tr -d "'" | sed 's/ *#.*$//')

# Remove trailing slash from SITE_URL if present
SITE_URL=${SITE_URL%/}
# Ensure BASE_URL starts with / if not empty, and doesn't end with /
if [ -n "$BASE_URL" ]; then
  [[ "$BASE_URL" != /* ]] && BASE_URL="/$BASE_URL"
  BASE_URL=${BASE_URL%/}
fi

POST_URL="${SITE_URL}${BASE_URL}/posts/${SLUG}/"
echo "post_url=${POST_URL}" >> $GITHUB_OUTPUT