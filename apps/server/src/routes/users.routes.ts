import { Router } from 'express';
import {
	findAUser,
	getAllFriendList,
	sendFriendRequest,
} from '../controllers/users.controllers';
import authMiddleware from '../middleware/clerk.middleware';

const router = Router();

router.route('/').get(findAUser);
router.route('/friend').post(authMiddleware, sendFriendRequest);
router.route('/friend').get(authMiddleware, getAllFriendList);

export default router;
