import express, { Application } from "express";
import cors from "cors";
import {
  ClerkExpressRequireAuth,
  ClerkExpressWithAuth,
  LooseAuthProp,
} from "@clerk/clerk-sdk-node";
import authMiddleware from "./middleware/clerk-middleware";
import supabase from "./lib/supabaseClient";
import * as dotenv from "dotenv";
import prisma from "./lib/prismaClient";

dotenv.config();

const app: Application = express();

declare global {
  namespace Express {
    interface Request extends LooseAuthProp {}
  }
}

app.use(cors());
app.use(express.json());

app.get("/", authMiddleware(), async (req, res) => {
  res.json({ message: "Hello World!" });
});

app.post("/clerk-webhook", async (req, res) => {
  const { data, type } = req.body;
  const { id, email_addresses, first_name, last_name, image_url } = data;

  console.log(data, type);

  if (typeof id === "string") {
    try {
      const email = email_addresses[0] ? email_addresses[0].email_address : "";

      if (type === "user.created") {
        const user = await prisma.user.create({
          data: {
            id,
            email,
            first_name,
            last_name,
            image_url,
          },
        });
        console.log("User inserted successfully:", user);
      }
      if (type === "user.updated") {
        const data = await prisma.user.update({
          where: {
            id,
          },
          data: {
            email,
            first_name,
            last_name,
            image_url,
          },
        });

        console.log("User updated successfully:", data);
      }
      if (type === "user.deleted") {
        const data = await prisma.user.delete({
          where: {
            id,
          },
        });

        console.log("User Deleted successfully:", data);
      }

      res.sendStatus(200);
    } catch (err) {
      console.error("Unexpected error:", err);
      res.status(500).json("Internal Server Error");
    }

    res.sendStatus(200);
  }
});

export default app;
