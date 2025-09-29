# $File: download_latest_voting_machine_sheet.py
# $Author: Jerry Zhu
# $Date: <2025-09-23 Tue>
# $Description:
# Automatically download the latest version of the voting machine sheet data,
# as a CSV file.
#
# Requires `playwright install`, before running
# we'll use chromium as it has the most amount of support.
import asyncio;
import os;
from playwright.async_api import async_playwright;

# NOTE(jerry):
# Headless browser seems to be detectable by Google and
# it might do a ROBOTS sort of check, so these automated browsers
# have to be non-headless, otherwise it will fail.
#
# Just do one login and remember credentials and it should work.

CREDENTIALS_PATH = "./google_login_credentials";
SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1Tun1FfKCt-R-ySg52MaqIsQXehyLR-gdOCzTO1rCAFk";

async def check_for_credentials():
    result = True;
    async with async_playwright() as p:
        browser = await p.chromium.launch_persistent_context(
            user_data_dir = CREDENTIALS_PATH,
            headless = False,
        );

        page = await browser.new_page();
        await page.goto(SPREADSHEET_URL);
        try:
            await page.wait_for_url(f"{SPREADSHEET_URL}/*", timeout=2000);
        except:
            print("Could not get to spreadsheet page, probably unauthenticated.");
            result = False;
        await browser.close();
    return result;

async def make_credentials():
    async with async_playwright() as p:
        browser = await p.chromium.launch_persistent_context(
            user_data_dir = CREDENTIALS_PATH,
            headless = False,
        );

        page = await browser.new_page();
        await page.goto(SPREADSHEET_URL);
        await page.wait_for_url(f"{SPREADSHEET_URL}/*", timeout=0);
        print("Okay, we found the target URL.");
        await browser.close();

async def main():
    has_credentials = await check_for_credentials();
    if not has_credentials:
        await make_credentials();

    async with async_playwright() as p:
        browser = await p.chromium.launch_persistent_context(
            user_data_dir = CREDENTIALS_PATH,
            headless = False,
        );

        page = await browser.new_page();

        # Little annoying, since curl makes this non obvious that it's
        # actually a request endpoint imo.
        print("Requesting data from spreadsheet.")
        response = await page.request.get(f"{SPREADSHEET_URL}/export?format=csv");
        content_response = await response.body();

        # Write as binary just to be less annoying,
        # it's fine. The text is utf-8 encoded.
        print("Writing spreadsheet data into data directory. (\"../raw/voting_machine_data.csv\")")
        with open("../raw/voting_machine_data.csv", "wb") as f:
            f.write(
                content_response
            );

        await browser.close();

asyncio.run(main());
