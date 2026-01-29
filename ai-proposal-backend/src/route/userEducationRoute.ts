import { educationValidation , updateEducationSchema } from "../middleware/EducationValidation";
import { Hono } from "hono";
import { AddEducation , updateEducation , readEducation , DeleteEducation } from "../controllers/userEducationController";
import { authMiddleware } from "../middleware/authValidator";
import { zValidator } from "@hono/zod-validator"
type Env ={
    Variables : {
        user : {id : string}
    };
};

const educationRoute = new Hono<Env>;
educationRoute.use("*", authMiddleware);

educationRoute.post("/", zValidator("json", educationValidation), AddEducation);
educationRoute.get("/", readEducation);
educationRoute.patch("/:id", zValidator("json", updateEducationSchema), updateEducation);
educationRoute.delete("/:id", DeleteEducation);

export default educationRoute;