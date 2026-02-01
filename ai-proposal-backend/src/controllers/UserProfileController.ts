import type { Context } from "hono";
import { db } from "../db";
import { ValidProfile } from "../middleware/UserProfileValidation";
import {  users_profile } from "../db/schema";
import { eq } from "drizzle-orm";



export const createProfile= async(c: Context)=>{
    const user =c.get("user");
    const body =await c.req.json();
    const validation=ValidProfile.safeParse(body);
    if (!user || !user.id) {
    return c.json({ success: false, message: "Unauthorized: Session missing" }, 401);
  }

    if(!validation.success) {
        return c.json({errors : validation.error.format()} , 400)
    };

    const [data] = await db
        .insert(users_profile)
        .values({ ...validation.data , user_id:user.id})
        .returning();

    return c.json({ success: true , data}, 201);

};

export const ReadProfile = async(c: Context)=>{
    const user = c.get("user");

    const data =await db.query.users_profile.findFirst({
        where: eq(users_profile.user_id , user.id) ,
        with:{
            skills:true,
            education:true ,
            experience:true,
        }
    });

    if(!data) {
        return c.json({error : "profile not found"} , 404)
    }
    return c.json({ success : true ,data}, 201);
};


export const UpdateProfilr = async (c:Context)=>{
    const user=c.get("user");
    const body=await c.req.json();

    const validation = ValidProfile.safeParse(body);

    if(!validation.success){
        return c.json({errors :validation.error.format()} , 400)
    };

    const [updated] = await db
        .update(users_profile)
        .set({...validation.data , updated_at:new Date()})
        .where(eq(users_profile.user_id , user.id))
        .returning();

    return c.json({success : true , data : updated})
};

export const DeleteProfile = async (c:Context)=>{
    const user = c.get("user");
    await db.delete(users_profile).where(eq(users_profile.user_id, user.id));

    return c.json({success:true , message : "profile deleted succesfully"});
};