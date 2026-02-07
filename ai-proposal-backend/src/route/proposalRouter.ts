import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/authValidator";
import { proposalGenerateValidation } from "../middleware/proposalValidator";
import { GenerateFinalProposal } from "../controllers/ProposalController";

type Env = {
    Variables: {
        user: { id: string }
    };
};

const proposalRouter = new Hono<Env>();


proposalRouter.use("*", authMiddleware);


proposalRouter.post("/generate", zValidator("json", proposalGenerateValidation), GenerateFinalProposal);

export default proposalRouter;