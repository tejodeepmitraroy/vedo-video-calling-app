import {
  ClerkExpressRequireAuth,
  ClerkMiddleware,
  RequireAuthProp,
  StrictAuthProp,
} from "@clerk/clerk-sdk-node";

const authMiddleware =
  // ClerkExpressRequireAuth({
  //   audience: "auth",
  //   onError: (error) => console.log("Unauthenticated", error),
  //   signInUrl: "/sign-in",
  //   // Add options here
  //   // See the Middleware options section for more details
  // });
  ClerkExpressRequireAuth({
    audience: "auth",
    onError: (error) => console.log("Unauthenticated USer", error),
    signInUrl: "/sign-in",
    // Add options here
    // See the Middleware options section for more details
  });

export default authMiddleware;
