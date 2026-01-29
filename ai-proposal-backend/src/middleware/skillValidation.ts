import { createInsertSchema  } from "drizzle-zod";
import { skills } from "../db/schema";

export const skillValidation = createInsertSchema(skills , {
    name : (s)=>s.min(1 , "skill name is required") ,
    level : (s)=>s.min(1 , "skill level is required ") ,

}) .omit({
    id:true,
    profile_id:true ,
    created_at: true,
});

export const updateSkillSchema=skillValidation.partial();