import { Hono } from "hono";
import { createProfile , UpdateProfilr , ReadProfile , DeleteProfile } from "../controllers/UserProfileController";
import { ValidProfile } from "../middleware/UserProfileValidation";
import { zValidator } from "@hono/zod-validator"
import {authMiddleware } from "../middleware/authValidator"
import { ZodError } from "zod";


type Env ={
    Variables : {
        user : {id : string}
    };
};


const profileRoutes = new Hono<Env>();

profileRoutes.get("/user" , authMiddleware , ReadProfile);
profileRoutes.post("/user" ,authMiddleware, zValidator("json" , ValidProfile , (result , c)=>{
    if(!result.success){
        const error = result.error as ZodError;
        return c.json({ 
        success: false, 
        errors: error.flatten().fieldErrors
      }, 400); }}) ,
 createProfile
)

profileRoutes.patch("/user" , authMiddleware, zValidator("json" , ValidProfile.partial() , (result ,c)=>{
    if (!result.success){
        const error = result.error as ZodError;
        return c.json({success : false , errors : error.flatten()} , 400)

    }}),
UpdateProfilr
);

profileRoutes.delete("/user" ,authMiddleware,  DeleteProfile);

export default profileRoutes;
