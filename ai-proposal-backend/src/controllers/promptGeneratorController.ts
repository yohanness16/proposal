import type { Context } from "hono";
import { db } from "../db";
import { generated_contents } from "../db/schema";
import { PromptGenerator } from "../../src/services/ai/promptGenerator";
type Bindings = {
  Variables: {
    user: { id: string };
  };
};

export const GenerateJobPrompt = async (c: Context<Bindings>) => {
  const user = c.get("user");
  const body = await c.req.json();
  const { jobId, tone, length } = body;

  try {
    const generator = new PromptGenerator();
    const { generatedPrompt, profileId } = await generator.generateMasterPrompt(
      jobId, 
      user.id, 
      tone, 
      length
    );

    const insertedRows = await db.insert(generated_contents).values({
      user_id: user.id,
      user_profile: profileId,
      jobs_id: jobId,
      content_type: "PROPOSAL_MASTER_PROMPT",
      content_status: "generated",
      tone: tone,
      length: length,
      model_used: "gemini-2.0-flash",
      prompt: generatedPrompt,
      structured_output: JSON.stringify({ status: "ready_to_render" }),
    }).returning();

    const record = insertedRows[0];
    if (!record) {
      throw new Error("Failed to insert generated content");
    }

    return c.json({
      success: true,
      data: {
        id: record.id,
        customInstructions: record.prompt
      }
    }, 201);

  } catch (error: any) {
    console.error("Prompt Generation Error:", error);
    return c.json({ 
      success: false, 
      error: error.message || "Failed to orchestrate prompt" 
    }, 500);
  }
};