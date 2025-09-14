import express, { Router } from 'express';
import { handleClerkWebhook } from '../controllers/webhook.controllers';

const router = Router();

router.post(
	'/clerk',
	express.raw({ type: 'application/json' }),
	handleClerkWebhook
);

export default router;
