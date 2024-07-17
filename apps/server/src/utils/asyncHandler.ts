import { NextFunction, Request, RequestHandler, Response } from 'express';

const asyncHandler =
	(handler: RequestHandler) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			return handler(req, res, next);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			res.status(error?.code || 5000).json({
				success: false,
				message: error.message,
			});
			next(error);
		}
	};

export default asyncHandler;
