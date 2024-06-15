import express, { Application } from "express";
import cors from "cors";
import {
  ClerkExpressRequireAuth,
  ClerkExpressWithAuth,
  LooseAuthProp,
} from "@clerk/clerk-sdk-node";
import authMiddleware from "./middleware/clerk-middleware";
import supabase from "./lib/supabaseClient";

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

app.post("/clerk-webhook", authMiddleware(), async (req, res) => {
  const { object, type } = req.body;

  if (type === "user.created" || type === "user.updated") {
    const { id, email_addresses } = object;
    const email = email_addresses[0].email_address;

    const { error } = await supabase
      .from("users")
      .upsert({ id, email }, { onConflict: "id" });

    if (error) {
      console.error("Error inserting/updating user in Supabase:", error);
      return res.status(500).send("Internal Server Error");
    }
  }

  res.sendStatus(200);
});

export default app;
