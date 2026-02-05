import { db } from "../../db";
import { 
  jobs, users_profile, skills, 
  experience, certifications, education 
} from "../../db/schema";
import { eq } from "drizzle-orm";

export class PromptGenerator {
  async generateMasterPrompt(jobId: string, userId: string, tone: string, length: number) {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));
    const [profile] = await db.select().from(users_profile).where(eq(users_profile.user_id, userId));
    
    if (!job) throw new Error("Job record not found in database.");
    if (!profile) throw new Error("User profile not found. Please create a profile first.");

    const [userSkills, userExp, userEdu, userCerts] = await Promise.all([
      db.select().from(skills).where(eq(skills.profile_id, profile.id)),
      db.select().from(experience).where(eq(experience.profile_id, profile.id)),
      db.select().from(education).where(eq(education.profile_id, profile.id)),
      db.select().from(certifications).where(eq(certifications.profile_id, profile.id))
    ]);

    const skillList = userSkills.length > 0 
      ? userSkills.map(s => `${s.name} (${s.level || 'expert'})`).join(", ") 
      : "General technical proficiency";

    const expList = userExp.length > 0 
      ? userExp.map(e => `- ${e.position} at ${e.company}: ${e.description}`).join("\n")
      : "Professional background in software delivery";

    const eduList = userEdu.length > 0
      ? userEdu.map(ed => `${ed.degree} in ${ed.field_of_study} from ${ed.school}`).join(", ")
      : "Relevant academic background";

    const certList = userCerts.length > 0
      ? userCerts.map(c => c.name).join(", ")
      : "Industry standard certifications";

    const masterPrompt = `
      # ROLE
      You are a specialized Proposal Writer. Your task is to write a tailored proposal for a candidate.

      # CANDIDATE PROFILE
      - Skills: ${skillList}
      - Experience: 
      ${expList}
      - Education: ${eduList}
      - Certifications: ${certList}

      # JOB REQUIREMENTS
      - Title: ${job.title}
      - Company: ${job.company_name}
      - Target Requirements: ${JSON.stringify(job.requirment)}
      - Main Responsibilities: ${job.responsibility}

      # OUTPUT INSTRUCTIONS
      - Write a proposal in a ${tone} tone.
      - Keep the length around ${length} words.
      - Lead with a technical hook about the company's specific needs.
      - Map the candidate's experience at ${userExp[0]?.company || 'their previous roles'} directly to the job's responsibilities.
      - Ask one insightful technical question at the end.
      - Output ONLY the proposal text.
      - the proposal should be concise, engaging, and directly address the job requirements while showcasing the candidate's unique qualifications.
       - the proposal should be not too long and too short 
    `;

    return {
      generatedPrompt: masterPrompt,
      profileId: profile.id
    };
  }
}