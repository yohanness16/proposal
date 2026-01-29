import { betterAuth } from "better-auth"
import { oneTap } from "better-auth/plugins"; 
import { emailOTP } from "better-auth/plugins";
import { twoFactor } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "../../../auth-schema.ts";
import * as sch from "../../db/schema.ts";
import { db } from "../../db/index.ts";

export const auth = betterAuth({
     database: drizzleAdapter(db, { 
    provider: "pg", 
    schema: {
          
          user: schema.user,
          session: schema.session,
          account: schema.account,
          verification: schema.verification,
          twoFactor: schema.twoFactor
        },
  }),
    appName: "proprsal",
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: { 
        enabled: true, 
  }, 
   
    socialProviders: {
        google: { 
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
            accessType: "offline", 
    
        }, 
    },
    plugins: [ 
        oneTap(), // Add the One Tap server plugin
        emailOTP({ 
            async sendVerificationOTP({ email, otp, type }) { 
                if (type === "sign-in") { 
                    // Send the OTP for sign in
                } else if (type === "email-verification") { 
                    // Send the OTP for email verification
                } else { 
                    // Send the OTP for password reset
                } 
            }, 
        }) ,
        twoFactor() 
    ] ,

    databaseHooks: {
  user: {
    create: {
      after: async (user) => {
        await db.insert(sch.usersTable).values({
          id: user.id, // 👈 ADD THIS LINE
          full_name: user.name,
          email: user.email,
          betterAuthUserId: user.id, 
          account_status: "active",
        });
      },
   
  

      },
    },

    
}}

)
