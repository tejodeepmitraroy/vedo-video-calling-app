import { Request, Response } from "express";

import asyncHandler from "../utils/asyncHandler";
import { ClerkMiddleware } from "@clerk/clerk-sdk-node";

interface ClerkUser {
  id: string;
  firstName: string;
  lastName: string;
  emailAddresses: { id: string, emailAddress: string }[];
  // Add other Clerk user properties if needed
}

declare global {
  namespace Express {
    interface Request {
      auth?: {
        user: ClerkUser;
      };
    }
  }
}

export const createCall = asyncHandler(
  async (request: Request , response: Response) => {

    const user = request.auth?.user

    console.log()

    



  }
);
