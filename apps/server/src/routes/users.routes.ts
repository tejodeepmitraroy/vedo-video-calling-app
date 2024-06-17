import { Router } from "express";
import { clerkWebhook } from "../controllers/users.controllers";
import authMiddleware from "../middleware/clerk.middleware";

const router = Router();

router.route("/webhook").post(clerkWebhook);

export default router;
