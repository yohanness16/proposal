import { Hono } from "hono";
import { AddSkills , updateSkill , readSkills , DeleteSkill } from "../controllers/UserSkillController";
import { skillValidation  , updateSkillSchema} from "../middleware/skillValidation";
import { zValidator } from "@hono/zod-validator"
import {authMiddleware } from "../middleware/authValidator"


type Env ={
    Variables : {
        user : {id : string}
    };
};

const skillRoute = new Hono<Env>;
skillRoute.use("*", authMiddleware);

skillRoute.post("/", zValidator("json", skillValidation), AddSkills);
skillRoute.get("/", readSkills);
skillRoute.patch("/:id", zValidator("json", updateSkillSchema), updateSkill);
skillRoute.delete("/:id", DeleteSkill);

export default skillRoute;

