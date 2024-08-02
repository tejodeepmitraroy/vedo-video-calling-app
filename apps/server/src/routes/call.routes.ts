import { Router } from 'express';
import authMiddleware from '../middleware/clerk.middleware';
import {
	callConnected,
	callMissed,
	callNoAnswer,
	callRejected,
	createACall,
	getCallLogs,
} from '../controllers/call.controllers';

const router = Router();

router
	.route('/')
	.post(authMiddleware, createACall)
	.get(authMiddleware, getCallLogs);

router.route('/callConnected/:callId').post(authMiddleware, callConnected);
router.route('/callMissed/:callId').post(authMiddleware, callMissed);
router.route('/callNoAnswer/:callId').post(authMiddleware, callNoAnswer);
router.route('/callRejected/:callId').post(authMiddleware, callRejected);

export default router;
