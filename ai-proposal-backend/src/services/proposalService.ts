import { GoogleGenerativeAI } from "@google/generative-ai";
import { PromptOrchestrator } from "../services//jobs/scrapper/PromptOrchestrator";

export class ProposalService {
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  private orchestrator = new PromptOrchestrator();

  async renderProposal(userId: string, jobId: string) {
    // 1. Get the High-Level Strategy Prompt from the Orchestrator
    const masterPrompt = await this.orchestrator.generateMasterPrompt(userId, jobId);

    // 2. Use a high-quality model for the final creative writing
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    try {
      // 3. Generate the actual proposal
      const result = await model.generateContent(masterPrompt);
      const proposalText = result.response.text();

      return {
        success: true,
        proposal: proposalText.trim(),
        generatedAt: new Date().toISOString()
      };
    } catch (error: any) {
      console.error("Proposal Generation Error:", error);
      throw new Error("Failed to generate final proposal text.");
    }
  }
}