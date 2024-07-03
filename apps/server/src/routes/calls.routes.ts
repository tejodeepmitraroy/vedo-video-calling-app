import { Router } from "express";
import authMiddleware from "../middleware/clerk.middleware";
import { createInstantCall, createScheduleCall, getACall } from "../controllers/calls.controllers";

const router = Router();

router.route("/:roomId").get( getACall);
router.route("/createInstantCall").post(authMiddleware, createInstantCall);
router.route("/createScheduleCall").post(authMiddleware, createScheduleCall);
// router.route('/scheduleCall').post();


export default router