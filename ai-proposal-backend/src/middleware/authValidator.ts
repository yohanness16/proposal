import type { Context, Next } from "hono";
import { auth } from "../services/auth/auth"; // Point to the file you just showed me

export const authMiddleware = async (c: Context, next: Next) => {
  // BetterAuth automatically detects the session from Cookies or Authorization Header
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ success: false, message: "Unauthorized: No session found" }, 401);
  }

  // We set the user in the context so 'createProfile' can find it
  c.set("user", session.user);
  
  await next();
};