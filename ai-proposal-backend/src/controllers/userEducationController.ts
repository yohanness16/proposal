import { db } from "../db";
import { educationValidation } from "../middleware/EducationValidation";
import {  education  } from "../db/schema";
import { eq } from "drizzle-orm";
import { getProfileId } from "../util/profileId";



export const AddEducation = async (c : any) => {
    const user = c.get("user") ;
    const body = await c.req.json() ;
    const profileId= await getProfileId(user.id) ; 

    if(!profileId){
        return c.json({error : "user_profile not found "} , 404)
    };

    const validation= educationValidation.safeParse(body);
    if(!validation.success){
        return c.json({errors : validation.error.format()} , 400)
    };

    const [data] = await db.insert(education).values({...validation.data , profile_id: profileId}).returning();
    return c.json({success : true , data , message:"successfully added education"} , 201);
};

export const readEducation = async (c: any) => {
  const user = c.get("user");
  const profileId = await getProfileId(user.id);
  if(!profileId){
    return c.json({error : "user_profile not found "} , 404)
}   
    const data = await db.select().from(education).where(eq(education.profile_id, profileId!)); 
    return c.json({ success: true, data } , 201);
};
export const updateEducation = async (c: any) => {  
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const validation= educationValidation.safeParse(body);
      if(!validation.success){
          return c.json({errors : validation.error.format()} , 400)
      }
    const [data] = await db.update(education)
      .set(validation.data)
      .where(eq(education.id, id))
      .returning();
  
    return c.json({ success: true, data } , 201);
  };
  
  export const DeleteEducation = async (c : any)=>{
      const id = c.req.param("id");
      await db.delete(education).where(eq(education.id , id));
      return c.json({ success: true, message: "Education deleted" } , 201);
  
  }
