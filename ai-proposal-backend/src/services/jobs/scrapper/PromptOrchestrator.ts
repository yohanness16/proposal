import { db } from "../../../db";
import { jobs, users_profile, skills, experience, education, certifications } from "../../../db/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

export class PromptOrchestrator {
  
  // Method to fetch everything about the user in one go
  private async getCompleteProfile(userId: string) {
    const [profile] = await db.select().from(users_profile).where(eq(users_profile.user_id, userId));
    if (!profile) throw new Error("Profile not found");

    const [userSkills, userExp, userEdu, userCerts] = await Promise.all([
      db.select().from(skills).where(eq(skills.profile_id, profile.id)),
      db.select().from(experience).where(eq(experience.profile_id, profile.id)),
      db.select().from(education).where(eq(education.profile_id, profile.id)),
      db.select().from(certifications).where(eq(certifications.profile_id, profile.id))
    ]);

    return { ...profile, skills: userSkills, experience: userExp, education: userEdu, certs: userCerts };
  }

  private async getJob(jobId: string) {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));
    return job;
  }

  static getProfileLevel(profile: any) {
    const hasEdu = profile.education?.length > 0;
    const hasSkills = profile.skills?.length > 0;
    const hasCerts = profile.certs?.length > 0;
    const hasExp = profile.experience?.length > 0;

    if (hasExp && hasSkills && hasEdu) return 4; 
    if (hasExp && (hasSkills || hasEdu)) return 3; 
    if (hasSkills || hasEdu || hasCerts) return 2; 
    return 1; 
  }

  async generateMasterPrompt(userId: string, jobId: string) {
    const userProfile = await this.getCompleteProfile(userId); 
    const job = await this.getJob(jobId);
    if (!job) throw new Error("Job not found");

    const level = PromptOrchestrator.getProfileLevel(userProfile);

    // 2. Aggregate Learned Strategies from your src/lib/strategies folder
    const strategyPath = path.join(process.cwd(), "src/lib/strategies");
    
    // Safety check: Create dir if it doesn't exist
    if (!fs.existsSync(strategyPath)) fs.mkdirSync(strategyPath, { recursive: true });
    
    const strategyFiles = fs.readdirSync(strategyPath);
    const combinedStrategies = strategyFiles
      .filter(file => file.endsWith('.json'))
      .map(file => fs.readFileSync(path.join(strategyPath, file), 'utf-8'))
      .join("\n---\n");

    const levelDirectives: Record<number, string> = {
      1: "FOCUS: Extreme Empathy & Intelligent Questioning. Since profile is thin, win by proving you understand the job better than anyone else.",
      2: "FOCUS: Skill Validation. Use Education/Certs as the 'Trust Bridge'. Highlight modern technical standards.",
      3: "FOCUS: Outcome Mapping. Link every skill to a specific past job impact or project success.",
      4: "FOCUS: Strategic Partnership. Talk like a consultant. Focus on ROI and business goals rather than just tasks."
    };

    return `
      You are an expert AI trained on these winning freelance strategies:
      ${combinedStrategies || "Default: Be concise and client-focused."}

      The current candidate is Level ${level}: ${levelDirectives[level]}
      
      # CANDIDATE DATA: 
      ${JSON.stringify(userProfile)}

      # JOB DATA: 
      ${JSON.stringify(job)}

      # YOUR TASK: 
      Based on the candidate level and the learned strategies, output a final System Prompt that will be used by another AI to write the actual proposal. Do not write the proposal yet, just the instructions.
    `;
  }
}