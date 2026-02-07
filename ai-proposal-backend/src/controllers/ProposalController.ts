import type { Context } from "hono";
import { ProposalService } from "../services/proposalService";

export const GenerateFinalProposal = async (c: Context) => {
  const user = c.get("user"); // Assumes your auth middleware is working
  const { jobId } = await c.req.json();

  if (!jobId) return c.json({ error: "Job ID is required" }, 400);

  const proposalService = new ProposalService();

  try {
    const result = await proposalService.renderProposal(user.id, jobId);
    
    return c.json(result, 200);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
};