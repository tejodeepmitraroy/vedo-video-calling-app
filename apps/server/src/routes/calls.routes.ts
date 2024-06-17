import { Router } from "express";
import authMiddleware from "../middleware/clerk.middleware";

const router = Router();

router.route("/createCall").post(authMiddleware,);
router.route('/scheduleCall').post();


export default router