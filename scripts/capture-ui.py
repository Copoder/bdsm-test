from pathlib import Path

from playwright.sync_api import sync_playwright


BASE_URL = "http://127.0.0.1:4399"
OUTPUT = Path(".gstack/ui-captures")


def capture(page, name: str) -> None:
    page.goto(BASE_URL, wait_until="networkidle")
    page.screenshot(path=OUTPUT / f"{name}.png", full_page=True)


OUTPUT.mkdir(parents=True, exist_ok=True)

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)

    mobile = browser.new_page(
        viewport={"width": 390, "height": 844},
        device_scale_factor=1,
        is_mobile=True,
        has_touch=True,
    )
    capture(mobile, "homepage-mobile")
    mobile.get_by_role("button", name="Show me what pulls").click()
    mobile.screenshot(path=OUTPUT / "gate-mobile.png", full_page=True)
    mobile.locator("[data-confirm='age']").check()
    mobile.get_by_role("button", name="Enter the test").click()
    mobile.screenshot(path=OUTPUT / "question-mobile.png", full_page=True)
    for current in range(1, 33):
        mobile.get_by_text("I'd lean in", exact=True).click()
        if current < 32:
            mobile.locator("[data-progress-label]").filter(has_text=f"{current + 1:02d} / 32").wait_for()
    mobile.locator("[data-result-primary]").wait_for(state="visible")
    mobile.screenshot(path=OUTPUT / "result-reveal-mobile.png", full_page=False)
    mobile.screenshot(path=OUTPUT / "result-mobile.png", full_page=True)
    mobile.goto(f"{BASE_URL}/consent-and-safety/", wait_until="networkidle")
    mobile.screenshot(path=OUTPUT / "content-mobile.png", full_page=True)
    mobile.close()

    desktop = browser.new_page(viewport={"width": 1440, "height": 1000})
    capture(desktop, "homepage-desktop")
    desktop.close()

    browser.close()
