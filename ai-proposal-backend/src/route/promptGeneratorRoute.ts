import { Hono } from "hono";
import { GenerateJobPrompt } from "../controllers/promptGeneratorController";
import { authMiddleware } from "../middleware/authValidator";
import { createPromptSchema } from "../middleware/promptValidator";
import { zValidator } from "@hono/zod-validator";

type Env = {
   Variables :  {
    user : {id:string};
   };
};

const promptRouter=new Hono<Env>;

promptRouter.use("*" , authMiddleware);

promptRouter.post("/"  , zValidator("json" , createPromptSchema) , GenerateJobPrompt);

export default promptRouter;
