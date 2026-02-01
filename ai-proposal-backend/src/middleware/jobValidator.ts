// src/middleware/jobValidator.ts
import { createInsertSchema } from "drizzle-zod";
import { jobs } from "../db/schema";
import { z } from "zod";

export const jobInsertValidation = createInsertSchema(jobs, {
  
  title: (s) => s.min(1, "Job title is required"),
  description: (s) => s.min(10, "Job description is too short"),
  source_link: (s) => s.url("Invalid source URL").optional(),
  requirment: z.record(z.string() , z.any()).default({}), 
  budget: (s) => s.optional(),
  company_name: (s) => s.optional(),
  location: (s) => s.default("remote"),
  responsibility: (s) => s.min(1, "Responsibility field cannot be empty"),
}).omit({
  id: true,
  user_id: true,
  searched_at: true,
});


export const updateJobSchema = jobInsertValidation.partial();