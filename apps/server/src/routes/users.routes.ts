import { Router } from 'express';
import {
	findAUser,
	getFriendList,
	sendFriendRequest,
} from '../controllers/users.controllers';
import authMiddleware from '../middleware/clerk.middleware';

const router = Router();

router.route('/:userName').get(findAUser);
router.route('/friend').post(authMiddleware, sendFriendRequest);
router.route('/friend').get(authMiddleware, getFriendList);

export default router;
