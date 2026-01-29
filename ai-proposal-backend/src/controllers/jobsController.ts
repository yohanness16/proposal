import { db } from "../db";
import { jobs } from "../db/schema";
import { JobSourceFactory } from "../services/jobs/jobSouecrFactory";       

export const AddJob = async (c: any) => {
  const user = c.get("user");
  const { type, content } = await c.req.json(); 

  try {
    const strategy = JobSourceFactory.createSource(type);
    const jobData = await strategy.process(content);

    const [newJob] = await db.insert(jobs).values({
      ...jobData,
      user_id: user.id,
    }).returning();

    return c.json({ success: true, data: newJob }, 201);
  } catch (error) {
    return c.json({ error: "Failed to process job source" }, 500);
  }
};