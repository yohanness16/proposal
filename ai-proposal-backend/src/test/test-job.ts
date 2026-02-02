// test-job.ts
import { JobSourceFactory } from "../services/jobs/jobSouecrFactory";
async function runTest() {
  console.log("🔍 Testing Full Pipeline: Scraper -> AI Extractor -> Factory...");
  
  const testUrl = "https://remoteok.com/remote-jobs/remote-google-cloud-platform-engineer-lightfeather-io-llc-1130011"; 

  try {
    const source = JobSourceFactory.createSource("website_link");
    console.log("⏳ Processing (Scraping + AI Extraction)...");
    
    const result = await source.process(testUrl);

    console.log("\n✨ AI STRUCTURED DATA RECEIVED:");
    console.log("-----------------------------------------");
    console.log("🏷️  Title:      ", result.title);
    console.log("🏢 Company:    ", result.company_name);
    console.log("💰 Budget:     ", result.budget);
    console.log("📍 Location:   ", result.location);
    console.log("📝 Description: ", result.description.substring(0, 150) + "...");
    console.log("✅ Responsibility: ", result.responsibility.substring(0, 1000) + "...");
    console.log("-----------------------------------------");
    
  } catch (error) {
    console.error("❌ PIPELINE FAILED:", error);
  }
}

runTest();