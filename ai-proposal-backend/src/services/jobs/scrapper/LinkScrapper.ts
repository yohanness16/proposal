import {chromium  } from 'playwright';
import { documents } from '../../../db/schema';


export class LinkScrapper {
    async scrapper(url : string) {
        const browser = await chromium.launch({ headless:true});
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' ,

        });
        const page = await context.newPage();

    try {
        await page.goto(url, { waitUntil: "networkidle" });

        
        await page.addStyleTag({ content: 'script, style, nav, footer { display: none !important; }' });

        const title = await page.title();
        
        
        const content = await page.locator("body").innerText();

        return {
        title: title.trim(),
        content: content.trim(),
        };
    } finally {
        await browser.close();
    }
    }};
