import { createInsertSchema  } from "drizzle-zod";
import { certifications } from "../db/schema";
import { z } from "zod";

export const userCertificateValidation = createInsertSchema(certifications , {
    name : (s)=>s.min(1 , "Certificate name is required") ,
    issuing_org : (s)=>s.min(1 , "Issuing organization is required ") ,
    issue_date: z.preprocess((arg) => typeof arg === "string" ? new Date(arg) : arg, z.date()),
    expiry_date: z.preprocess((arg) => typeof arg === "string" ? new Date(arg) : arg, z.date()).optional(),
    credential_id : (s)=>s.min(1 , "Credential ID is required ") ,
    credential_url : (s)=>s.url("Please provide a valid URL").optional(),
}) .omit({
    id:true,
    profile_id:true ,
   
});

export const updateUserCertificateSchema=userCertificateValidation.partial();