import type { Context, Next } from "hono";
import { auth } from "../services/auth/auth"; 

export const authMiddleware = async (c: Context, next: Next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });
  if (!session) {
    return c.json({ success: false, message: "Unauthorized: No session found" }, 401);
  }
  c.set("user", session.user);
  await next();
};