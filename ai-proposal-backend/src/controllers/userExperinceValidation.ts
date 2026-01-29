import { db } from "../db";
import { experienceValidation } from "../middleware/experinceValidation";
import {  experience  } from "../db/schema";
import { eq } from "drizzle-orm";
import { getProfileId } from "../util/profileId";



export const AddExperience = async (c : any) => {
    const user = c.get("user") ;
    const body = await c.req.json() ;
    const profileId= await getProfileId(user.id) ; 

    if(!profileId){
        return c.json({error : "user_profile not found "} , 404)
    };

    const validation= experienceValidation.safeParse(body);
    if(!validation.success){
        return c.json({errors : validation.error.format()} , 400)
    };

    const [data] = await db.insert(experience).values({...validation.data , profile_id: profileId}).returning();
    return c.json({success : true , data , message:"successfully added experience"} , 201);
};

export const readExperience = async (c: any) => {
  const user = c.get("user");
  const profileId = await getProfileId(user.id);
  if(!profileId){
    return c.json({error : "user_profile not found "} , 404)
}

  const data = await db.select().from(experience).where(eq(experience.profile_id, profileId!));
  return c.json({ success: true, data });
};  
export const updateExperience = async (c: any) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  
  const validation= experienceValidation.safeParse(body);
    if(!validation.success){
        return c.json({errors : validation.error.format()} , 400)
    };

  const [data] = await db.update(experience)
    .set(validation.data)
    .where(eq(experience.id, id))
    .returning();

  return c.json({ success: true, data });
};

export const DeleteExperience = async (c : any)=>{
    const id = c.req.param("id");
    await db.delete(experience).where(eq(experience.id , id));
    return c.json({ success: true, message: "Experience deleted" });

}       