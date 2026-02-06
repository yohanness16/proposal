import { chromium } from 'playwright-extra';
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

chromium.use(stealthPlugin());

export class StrategyLearner {
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  async learn(url: string) {
    // 1. SET HEADLESS TO FALSE so you can see if it gets stuck!
    const browser = await chromium.launch({ 
      headless: false, 
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();

    try {
      console.log(`📡 Navigating to: ${url}`);
      
      // 2. Shorten the wait to 'domcontentloaded' and add a total timeout
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      
      // 3. Look for Cloudflare "Challenge" title
      const title = await page.title();
      if (title.includes("Just a moment") || title.includes("Attention Required")) {
        console.log("⚠️ Cloudflare detected. Solve it in the window or wait...");
        await page.waitForTimeout(10000); // Give you 10 seconds to manually click if needed
      }

      await page.waitForTimeout(3000); // Brief wait for JS to settle

      // Clean the page
      await page.addStyleTag({ content: 'nav, footer, header, aside, script, style { display: none !important; }' });
      
      const rawContent = await page.locator("body").innerText();
      const cleanText = rawContent.replace(/\s+/g, ' ').substring(0, 8000); // Smaller chunk for Gemini

      console.log(`🧠 Teaching AI strategy from ${url.substring(0, 30)}...`);

      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

      // 4. Add a AbortController or timeout to the Gemini call
      const result = await model.generateContent(
        `Analyze this freelance advice. Return ONLY JSON: { "win_rules": [] }. TEXT: ${cleanText}`
      );

      const response = await result.response;
      const jsonText = response.text().replace(/```json|```/g, "");
      
      const fileName = `web_${url.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
      const filePath = path.join(process.cwd(), "src/lib/strategies", fileName);
      
      fs.writeFileSync(filePath, jsonText);
      console.log(`✅ Success: ${fileName}`);

    } catch (err: any) {
      console.error(`❌ Skipped ${url}: ${err.message}`);
    } finally {
      await browser.close();
    }
  }
}