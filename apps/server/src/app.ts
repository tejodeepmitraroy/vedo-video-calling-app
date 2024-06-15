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
  const { id, email_addresses } = data;

  console.log(data, type);

  try {
    if (type === "user.created" || type === "user.updated") {
      const email = email_addresses[0].email_address;

      const { data, error } = await supabase
        .from("users")
        .upsert({ id, email }, { onConflict: "id" })
        .select();

      if (error) {
        console.error("Error inserting/updating user in Supabase:", error);
        return res.status(500).send("Internal Server Error");
      }

      console.log("User inserted/updated successfully:", data);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).send("Internal Server Error");
  }

  res.sendStatus(200);
});

export default app;
