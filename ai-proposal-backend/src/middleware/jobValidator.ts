import { createInsertSchema } from "drizzle-zod";
import { jobs } from "../db/schema";
import { z } from "zod";

// This is what the DB expects
export const jobDbSchema = createInsertSchema(jobs).omit({
  id: true,
  user_id: true,
  searched_at: true,
});

// This is what the Postman/Frontend sends
export const jobInsertValidation = z.object({
  type: z.enum(["website_link", "Text", "pdf"]),
  content: z.string().min(1, "Content is required"),
});

export const updateJobSchema = jobDbSchema.partial();