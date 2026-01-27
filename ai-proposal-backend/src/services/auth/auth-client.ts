
import { createAuthClient } from "better-auth/client";
import { oneTapClient } from "better-auth/client/plugins";
import { emailOTPClient } from "better-auth/client/plugins";
import { twoFactorClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [
    oneTapClient({
      clientId: process.env.GOOGLE_CLIENT_ID as string, 
      // Optional client configuration:
      autoSelect: false,
      cancelOnTapOutside: true,
      context: "signin",
      additionalOptions: {
        // Any extra options for the Google initialize method
      },
      // Configure prompt behavior and exponential backoff:
      promptOptions: {
        baseDelay: 1000,   // Base delay in ms (default: 1000)
        maxAttempts: 5     // Maximum number of attempts before triggering onPromptNotification (default: 5)
      }
    }),
     emailOTPClient(),
     twoFactorClient()
  ]
});

const signIn = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
  
  });
};



