import { db } from "../db";
import { certifications  } from "../db/schema";
import { userCertificateValidation } from "../middleware/userCertificateValidator";
import { eq } from "drizzle-orm";
import { getProfileId } from "../util/profileId";

export const AddUserCertificate = async (c : any) => {
    const user = c.get("user") ;
    const body = await c.req.json() ;
    const profileId= await getProfileId(user.id) ;

    if(!profileId){
        return c.json({error : "user_profile not found "} , 404)
    };

    const validation= userCertificateValidation.safeParse(body);
    if(!validation.success){
        return c.json({errors : validation.error.format()} , 400)
    };

    const [data] = await db.insert(certifications).values({...validation.data , profile_id: profileId}).returning();
    return c.json({success : true , data , message:"successfully added certificate"} , 201);
};

export const readUserCertificates = async (c: any) => {
  const user = c.get("user");
  const profileId = await getProfileId(user.id);
  if(!profileId){
    return c.json({error : "user_profile not found "} , 404)
}   
    const data = await db.select().from(certifications).where(eq(certifications.profile_id, profileId!));
    return c.json({ success: true, data } , 200);
};
export const updateUserCertificate = async (c: any) => {  
    const id = c.req.param("id");
    const body = await c.req.json();
    
    const validation= userCertificateValidation.safeParse(body);
      if(!validation.success){
          return c.json({errors : validation.error.format()} , 400)
      }
    const [data] = await db.update(certifications)
      .set(validation.data)
      .where(eq(certifications.id, id))
      .returning();
  
    return c.json({ success: true, data } , 200);
  };
  
export const DeleteUserCertificate = async (c : any)=>{
      const id = c.req.param("id");
      await db.delete(certifications).where(eq(certifications.id , id));
      return c.json({ success: true, message: "Certificate deleted" } , 200);
  
  }     

