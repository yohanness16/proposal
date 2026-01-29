import { Hono } from "hono";
import { AddExperience , updateExperience , readExperience , DeleteExperience } from "../controllers/userExperinceValidation";
import { authMiddleware } from "../middleware/authValidator";
import { zValidator } from "@hono/zod-validator"
import { experienceValidation , updateExperinceSchema } from "../middleware/experinceValidation";


type Env ={
    Variables : {
        user : {id : string}
    };
};  

const experienceRoute = new Hono<Env>;
experienceRoute.use("*", authMiddleware);

experienceRoute.post("/", zValidator("json", experienceValidation), AddExperience);
experienceRoute.get("/", readExperience);
experienceRoute.patch("/:id", zValidator("json", updateExperinceSchema), updateExperience);
experienceRoute.delete("/:id", DeleteExperience);

export default experienceRoute;