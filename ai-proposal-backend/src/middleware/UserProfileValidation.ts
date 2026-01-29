
import { createInsertSchema } from "drizzle-zod";
import { users_profile } from "../db/schema";

export const ValidProfile = createInsertSchema(users_profile , {
   bio: (s) => s.min(10, "Bio must be at least 10 characters long"),
  language: (s) => s.min(2, "Invalid language format"),
  github_link: (s) => s.url("Please provide a valid URL").optional(),
}).omit({
    id:true,
    user_id:true,
    updated_at:true,

});
    