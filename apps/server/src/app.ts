import express, { Application } from "express";
import cors from "cors";
import authMiddleware from "./middleware/clerk.middleware";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./routes/users.routes";
import callRouter from "./routes/calls.routes";

dotenv.config();

const app: Application = express();

// console.log(process.env.FRONTEND_URL);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/call", callRouter);

app.get("/", async (req, res) => {
  res.json({ message: "Server is 100% up running" });
});

export default app;
