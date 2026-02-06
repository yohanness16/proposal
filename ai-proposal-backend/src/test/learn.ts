import { StrategyLearner } from "../../src/services/jobs/scrapper/webScrapper"; // The class we built with Playwright-extra
import path from "path";
import fs from "fs";

const LINKS = [
  "https://www.projectmanager.com/blog/how-to-create-a-project-proposal",
  "https://www.linkedin.com/pulse/10-helpful-tips-writing-winning-freelance-job-proposal-finidi-lawson",
  
  "https://www.babson.edu/media/babson/assets/teaching-research/writing-a-successful-proposal.pdf",
  "https://wise.com/in/blog/upwork-proposal-samples",
  "https://www.upwork.com/resources/how-to-write-a-cover-letter"
];

async function runTraining() {
  const learner = new StrategyLearner();
  const targetDir = path.join(process.cwd(), "src/lib/strategies");

  // Ensure directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  console.log("🚀 Starting AI Strategy Training...");

  for (const url of LINKS) {
    try {
      console.log(`📡 Learning from: ${url}`);
      await learner.learn(url);
      console.log(`✅ Strategy saved for ${url}`);
    } catch (error) {
      console.error(`❌ Failed to learn from ${url}:`, error);
    }
  }

  console.log("\n✨ Training Complete! Your 'src/lib/strategies' folder is now populated.");
  process.exit(0);
}

runTraining();