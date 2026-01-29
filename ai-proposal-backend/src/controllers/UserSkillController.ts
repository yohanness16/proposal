
import { success } from "better-auth";
import { db } from "../db";
import { skills , users_profile } from "../db/schema";
import { eq , and  } from "drizzle-orm";


const getProfileId = async (userId: string) => {
  const profile = await db.query.users_profile.findFirst({
    where: eq(users_profile.user_id, userId),
  });
  return profile?.id;
};

export const AddSkills = async (c : any) => {
    const user = c.get("user") ;
    const body = await c.req.json() ;
    const profileId= await getProfileId(user.id) ; 

    if(!profileId){
        return c.json({error : "user_profile not found "} , 404)
    };

    const [data] = await db.insert(skills).values({...body , profile_id: profileId}).returning();
    return c.json({success : true , data , message:"successfully added skills"} , 201);
};

export const readSkills = async (c: any) => {
  const user = c.get("user");
  const profileId = await getProfileId(user.id);

  const data = await db.select().from(skills).where(eq(skills.profile_id, profileId!));
  return c.json({ success: true, data });
};


export const updateSkill = async (c: any) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  
  const [data] = await db.update(skills)
    .set(body)
    .where(eq(skills.id, id))
    .returning();

  return c.json({ success: true, data });
};

export const DeleteSkill = async (c : any)=>{
    const id = c.req.param("id");
    await db.delete(skills).where(eq(skills.id , id));
    return c.json({ success: true, message: "Skill deleted" });

}

