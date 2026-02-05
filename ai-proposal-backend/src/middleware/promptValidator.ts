import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

export const createPromptSchema = z.object({
  jobId: z.string().uuid("Invalid Job ID format"),
  tone: z.string().default("Professional"),
  length: z.number().min(50).max(1000).default(300),
});

export const validatePromptRequest = zValidator("json", createPromptSchema);