import { db } from "../db";
import { users_profile } from "../db/schema";
import { eq } from "drizzle-orm";

 export const getProfileId = async (userId: string) => {
  const profile = await db.query.users_profile.findFirst({
    where: eq(users_profile.user_id, userId),
  });
  return profile?.id;
};