import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function buildBrain() {
  const strategyDir = path.join(process.cwd(), "src/lib/strategies");
  const files = fs.readdirSync(strategyDir);

  // 1. Load all learned strategies
  const combinedStrategies = files
    .filter(f => f.endsWith(".json"))
    .map(f => {
      const content = fs.readFileSync(path.join(strategyDir, f), "utf-8");
      return `Source: ${f}\nStrategy: ${content}`;
    })
    .join("\n\n");

  console.log(`📑 Aggregating ${files.length} strategies...`);

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `
    You are a Meta-Prompt Engineer. I have scrapped the best freelance proposal strategies from the web.
    YOUR TASK: Analyze these strategies and create 4 distinct "System Prompts". 
    Each prompt will be used to tell an AI how to write a proposal for a specific user level.

    LEVELS:
    1. LEVEL_1_NEWBIE: No profile data. Strategy should focus on "The Hook" and "Insightful Questions".
    2. LEVEL_2_RISING: Only Education/Skills. Strategy should focus on "Modern Pedigree" and "Potential".
    3. LEVEL_3_PROFESSIONAL: Good Skills + some Experience. Strategy should focus on "Proof of Impact".
    4. LEVEL_4_MASTER: Full Profile (Skills, Exp, Edu, Certs). Strategy should focus on "Consultative ROI" and "Strategic Partnership".

    LEARNED STRATEGIES:
    ${combinedStrategies}

    Output ONLY a valid JSON object with this exact structure:
    {
      "LEVEL_1_NEWBIE": "string (the full system prompt instructions)",
      "LEVEL_2_RISING": "string (the full system prompt instructions)",
      "LEVEL_3_PROFESSIONAL": "string (the full system prompt instructions)",
      "LEVEL_4_MASTER": "string (the full system prompt instructions)"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const jsonOutput = result.response.text().replace(/```json|```/g, "");
    
    fs.writeFileSync(
      path.join(process.cwd(), "src/lib/promptGenerator.json"),
      jsonOutput
    );
    console.log("✨ promptGenerator.json created successfully in src/lib!");
  } catch (err) {
    console.error("❌ Failed to build brain:", err);
  }
}

buildBrain();