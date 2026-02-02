
import { chromium } from 'playwright-extra'; 
import stealthPlugin from "puppeteer-extra-plugin-stealth";


const stealth = stealthPlugin();
chromium.use(stealth);

export class LinkScrapper {
    async scrapper(url: string) {
        
        const browser = await chromium.launch({ 
            headless: true,
            args: ['--no-sandbox'] 
        });

        const context = await browser.newContext({
            
            userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            viewport: { width: 1280, height: 720 },
            extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' }
        });

        const page = await context.newPage();

        try {
           
            await page.goto(url, { 
                waitUntil: "domcontentloaded", 
                timeout: 60000 
            });


            await page.waitForTimeout(6000);

            
            await page.addStyleTag({ content: 'script, style, nav, footer, header { display: none !important; }' });

            const title = await page.title();
            
            if (title.includes("Challenge") || title.includes("Just a moment")) {
                throw new Error("Blocked by Cloudflare. Try setting 'headless: false' once to solve it manually.");
            }
            
            const content = await page.locator("body").innerText();

            return {
                title: title.trim(),
                content: content.trim()
            };
        } finally {
            await browser.close();
        }
    }
}