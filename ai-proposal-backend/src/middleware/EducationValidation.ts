import { createInsertSchema  } from "drizzle-zod";
import { education } from "../db/schema";
import { z } from "zod";

export const educationValidation = createInsertSchema(education , {
    school : (s)=>s.min(1 , "school name is required") ,
    degree : (s)=>s.min(1 , "degree  is required ") ,
    field_of_study : (s)=>s.min(1 , "field of study is required ") ,
    start_date: z.preprocess((arg) => typeof arg === "string" ? new Date(arg) : arg, z.date()),
    end_date: z.preprocess((arg) => typeof arg === "string" ? new Date(arg) : arg, z.date()).optional(),
    description : (s)=>s.min(10 , "description should be at least 10 characters ") ,    
}) .omit({
    id:true,
    profile_id:true ,   
});

export const updateEducationSchema=educationValidation.partial();