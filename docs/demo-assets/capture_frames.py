"""Capture Build Week demo frames from the live Debrief app."""
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).resolve().parent
LIVE = "https://debrief-psi.vercel.app"
EMAIL = "demo@debrief.app"
PASSWORD = "DemoBuildWeek2026!"
WS = "e72d3aef-fc6a-40ca-943f-12e71baa3a5c"


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        page.goto(f"{LIVE}/", wait_until="networkidle")
        page.wait_for_timeout(800)
        page.screenshot(path=OUT / "frame-01-home.png", full_page=False)

        page.goto(f"{LIVE}/login", wait_until="networkidle")
        page.wait_for_timeout(500)
        # If already redirected to dashboard, skip login form
        if "/login" in page.url:
            page.get_by_role("button", name="Use demo").click()
            page.wait_for_timeout(300)
            page.get_by_label("Password").fill(PASSWORD)
            page.get_by_role("button", name="Sign in to Debrief").click()
            page.wait_for_url("**/dashboard**", timeout=20000)
        page.wait_for_timeout(1200)
        page.screenshot(path=OUT / "frame-02-dashboard.png", full_page=False)

        page.goto(f"{LIVE}/workspaces/{WS}", wait_until="networkidle")
        page.wait_for_selector("text=Launch Planning", timeout=20000)
        page.wait_for_timeout(2000)
        page.screenshot(path=OUT / "frame-03-workspace.png", full_page=False)

        # Scroll into Decision Brief / open a section
        page.evaluate("window.scrollTo(0, 420)")
        page.wait_for_timeout(600)
        page.screenshot(path=OUT / "frame-04-brief.png", full_page=False)

        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(600)
        page.screenshot(path=OUT / "frame-05-docs-chat.png", full_page=False)

        browser.close()
        print("frames saved to", OUT)


if __name__ == "__main__":
    main()
