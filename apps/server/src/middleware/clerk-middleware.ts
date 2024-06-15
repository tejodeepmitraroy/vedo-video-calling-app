import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
  StrictAuthProp,
} from "@clerk/clerk-sdk-node";

import { clerkClient } from "@clerk/clerk-sdk-node";

const authMiddleware = () =>
  ClerkExpressRequireAuth({
    audience: "auth",
    onError: (error) => console.log("Unauthenticated", error),
    signInUrl: "/sign-in",
    // Add options here
    // See the Middleware options section for more details
  });

export default authMiddleware;