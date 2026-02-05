import type { Context } from "hono";
import { db } from "../db";
import { jobs } from "../db/schema";
import { JobSourceFactory } from "../services/jobs/jobSouecrFactory";

// Define the variable type clearly
type Bindings = {
  Variables: {
    user: { id: string };
  };
};

export const AddJob = async (c: Context<Bindings>) => {
  // 1. Check user context immediately
  const user = c.get("user");
  
  if (!user || !user.id) {
    return c.json({ 
      success: false, 
      error: "Unauthorized: User session not found in context" 
    }, 401);
  }

  try {
    // 2. Parse body
    const body = await c.req.json();
    const { type, content } = body;

    if (!type || !content) {
      return c.json({ error: "Type and Content are required" }, 400);
    }

    // 3. Process with Factory Strategy
    const strategy = JobSourceFactory.createSource(type);
    const jobData = await strategy.process(content);

    // 4. Insert to Database
    const [newJob] = await db.insert(jobs).values({
      user_id: user.id,
      source_type: jobData.source_type,
      source_link: jobData.source_link,
      title: jobData.title,
      description: jobData.description,
      company_name: jobData.company_name,
      requirment: jobData.requirment,
      responsibility: jobData.responsibility,
      deadline: jobData.deadline,
      budget: jobData.budget,
      location: jobData.location,
    }).returning();

    return c.json({ success: true, data: newJob }, 201);
    
  } catch (error: any) {
    console.error("AddJob Error:", error);
    return c.json({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, 500);
  }
};