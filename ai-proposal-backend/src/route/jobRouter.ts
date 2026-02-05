import { Hono } from "hono";
import { AddJob } from "../controllers/jobsController";
import { jobInsertValidation } from "../middleware/jobValidator";
import { authMiddleware } from "../middleware/authValidator";
import { zValidator } from "@hono/zod-validator";

type Env ={
    Variables : {
        user : {id : string}
    };
};

const jobRouter = new Hono<Env>;
jobRouter.use("*", authMiddleware);

jobRouter.post("/" , zValidator("json" , jobInsertValidation) , AddJob);

export default jobRouter;
