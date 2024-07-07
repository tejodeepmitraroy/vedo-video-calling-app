import { Router } from "express";
import { clerkWebhook } from "../controllers/users.controllers";

const router = Router();

router.route("/webhook").post(clerkWebhook);

export default router;
