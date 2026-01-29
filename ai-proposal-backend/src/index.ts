import { Hono } from "hono";
import {logger} from "hono/logger";
import { csrf } from "hono/csrf";
import { auth } from "./services/auth/auth";
import profileRoutes from "./route/userProfileRoute";
import skillRoute from "./route/userSkillRoute";
import experienceRoute from "./route/userExperince";
import educationRoute from "./route/userEducationRoute";
import certificateRoute from "./route/userCertificateRoute";


const app = new Hono();

app.use("*" , logger());
app.use("*" , csrf()) ;

app.get("/" , (c)=>c.text("app is running "));
app.route("/api/profile" , profileRoutes);
app.route("/api/skills" , skillRoute);
app.route("/api/experience" , experienceRoute);
app.route("/api/education" , educationRoute);
app.route("/api/certificates" , certificateRoute);
app.on(["POST", "GET" , "PUT" , "PATCH" , "DELETE"], "/api/auth/*", (c) => auth.handler(c.req.raw));

export default app;