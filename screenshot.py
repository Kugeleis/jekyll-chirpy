from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # Desktop
        context = browser.new_context(viewport={'width': 1280, 'height': 720})
        page = context.new_page()
        page.goto('http://127.0.0.1:4000/jekyll-chirpy/posts/hallo-welt/')
        time.sleep(2)
        page.screenshot(path='desktop-post.png')

        # Mobile Post
        context_mobile = browser.new_context(viewport={'width': 375, 'height': 667}, user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/004.1')
        page_mobile = context_mobile.new_page()
        page_mobile.goto('http://127.0.0.1:4000/jekyll-chirpy/posts/hallo-welt/')
        time.sleep(2)
        page_mobile.screenshot(path='mobile-post.png')

        browser.close()

if __name__ == "__main__":
    run()
