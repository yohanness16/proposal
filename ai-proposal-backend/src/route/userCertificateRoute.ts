import { Hono } from "hono";
import  { AddUserCertificate , updateUserCertificate , readUserCertificates , DeleteUserCertificate } from "../controllers/userCertificateController";
import { authMiddleware } from "../middleware/authValidator";
import { zValidator } from "@hono/zod-validator"
import { userCertificateValidation , updateUserCertificateSchema } from "../middleware/userCertificateValidator";

type Env ={
    Variables : {
        user : {id : string}
    };
};

const certificateRoute = new Hono<Env>;
certificateRoute.use("*", authMiddleware);

certificateRoute.post("/", zValidator("json", userCertificateValidation), AddUserCertificate);
certificateRoute.get("/", readUserCertificates);
certificateRoute.patch("/:id", zValidator("json", updateUserCertificateSchema), updateUserCertificate);
certificateRoute.delete("/:id", DeleteUserCertificate);
export default certificateRoute;