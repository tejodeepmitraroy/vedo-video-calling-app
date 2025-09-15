import { requireAuth } from '@clerk/express';

const authMiddleware = requireAuth();

export default authMiddleware;
