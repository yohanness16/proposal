import { z } from "zod";

export const proposalGenerateValidation = z.object({
  jobId: z.string().uuid({ message: "Invalid Job ID format" }),
  tone: z.string().min(1).default("Professional"),
  length: z.number().int().min(50).max(1000).default(300),
});