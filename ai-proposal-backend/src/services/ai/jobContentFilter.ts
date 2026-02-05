
import { GoogleGenerativeAI } from "@google/generative-ai";

export class JobExtractor {
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  async extract(rawText: string) {
    const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `
      You are a professional recruitment parser. I will give you a messy text scrape from a job board. 
      Your goal is to extract the clean data. find money related things may be payment and if payment in json make salary inplace of  budget and write the salary of thr job 

      
      Output ONLY a valid JSON object with these keys:
      {
        "title": "string",
        "company_name": "string",
        "description": "string (concise overview)",
        "responsibility": "string (bullet points)",
        "requirements": "object (key-value pairs of skills)",
        "budget": "string (e.g. $1k/week or $115k)" ,
        "deadline": "string (ISO 8601 date format)",
        "location": "string"
      }

    RAW TEXT:
      ${rawText.substring(0, 15000)}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    
    const cleanJson = text.replace(/```json|```/g, "");
    return JSON.parse(cleanJson);
  }
}