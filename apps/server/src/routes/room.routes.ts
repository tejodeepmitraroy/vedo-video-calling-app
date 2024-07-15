import { Router } from 'express';
import authMiddleware from '../middleware/clerk.middleware';
import {
	createInstantRoom,
	createScheduleCall,
	deleteScheduledRoom,
	getAllRooms,
	// getAllScheduledRooms,
	getRoomDetails,
	getScheduledRoom,
	updateScheduledRoom,
} from '../controllers/room.controllers';

const router = Router();

router
	.route('/')
	.post(authMiddleware, createInstantRoom)
	.get(authMiddleware, getAllRooms);
router.route('/:roomId').get(getRoomDetails);

router
	.route('/schedule')
	.post(authMiddleware, createScheduleCall)
	.get(authMiddleware, getScheduledRoom)
	.put(authMiddleware, updateScheduledRoom)
	.delete(authMiddleware, deleteScheduledRoom);

// router
// 	.route('/schedule/:roomId')
//  .get(authMiddleware, getScheduledRoom)
// 	.delete(authMiddleware, deleteScheduledRoom);

export default router;
