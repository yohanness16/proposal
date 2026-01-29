import { createInsertSchema  } from "drizzle-zod";
import { experience } from "../db/schema";
import { z } from "zod";

export const experienceValidation = createInsertSchema(experience , {
    company : (s)=>s.min(1 , "company name is required") ,
    position : (s)=>s.min(1 , "postion  is required ") ,
    location : (s)=>s.min(1 , "location is required ") ,
    start_date: z.preprocess((arg) => typeof arg === "string" ? new Date(arg) : arg, z.date()),
    end_date: z.preprocess((arg) => typeof arg === "string" ? new Date(arg) : arg, z.date()).optional(),
    description : (s)=>s.min(10 , "description should be at least 10 characters ") ,
    is_current : (s)=>s.optional(),


}) .omit({
    id:true,
    profile_id:true ,
   
});

export const updateExperinceSchema=experienceValidation.partial();