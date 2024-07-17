import { Router } from 'express';
import authMiddleware from '../middleware/clerk.middleware';
import {
	createInstantRoom,
	createScheduleCall,
	deleteScheduledRoom,
	getAllRooms,
	getAllScheduledRoomsDetails,
	getScheduledRoom,
	updateScheduledRoom,
} from '../controllers/room.controllers';

const router = Router();

router
	.route('/')
	.post(authMiddleware, createInstantRoom)
	.get(authMiddleware, getAllRooms);
// router.route('/:roomId').get(getRoomDetails);

router
	.route('/schedule')
	.post(authMiddleware, createScheduleCall)
	.get(authMiddleware, getAllScheduledRoomsDetails)
	.put(authMiddleware, updateScheduledRoom);

router
	.route('/schedule/:roomId')
	.get(authMiddleware, getScheduledRoom)
	.delete(authMiddleware, deleteScheduledRoom);

export default router;
