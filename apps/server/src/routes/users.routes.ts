import { Router } from 'express';
import {
	findAUser,
	getAllFriendList,
	removeFriend,
	sendFriendRequest,
} from '../controllers/users.controllers';
import authMiddleware from '../middleware/clerk.middleware';

const router = Router();

router.route('/').get(authMiddleware, findAUser);
router
	.route('/friend')
	.post(authMiddleware, sendFriendRequest)
	.get(authMiddleware, getAllFriendList)
	.delete(authMiddleware, removeFriend);

export default router;
