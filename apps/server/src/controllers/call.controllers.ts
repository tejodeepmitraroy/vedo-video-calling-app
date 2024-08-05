import { Response } from 'express';
import { AuthenticatedRequest } from '../types/apiRequest';
import asyncHandler from '../utils/asyncHandler';
import prisma from '../lib/prismaClient';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';

export const createACall = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		const userId = request.auth!.userId;
		const { receiver } = request.body;
		console.log(request.body);

		try {
			const callDetails = await prisma.call.create({
				data: {
					callerId: userId,
					receiverId: receiver,
				},
			});

			console.log(callDetails);

			return response.status(200).json(new ApiResponse(200, callDetails));
		} catch (error) {
			console.log(error);
			return response
				.status(400)
				.json(new ApiError(400, 'Error Happened', error));
		}
	}
);

export const getCallLogs = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		const userId = request.auth?.userId;

		try {
			const callDetails = await prisma.call.findMany({
				where: {
					OR: [
						{
							callerId: {
								contains: userId,
							},
						},
						{
							receiverId: {
								contains: userId,
							},
						},
					],
				},
			});

			console.log(callDetails);

			return response.status(200).json(new ApiResponse(200, callDetails));
		} catch (error) {
			console.log(error);
			return response
				.status(400)
				.json(new ApiError(400, 'Error Happened', error));
		}
	}
);

// export const updateCallStatus = asyncHandler(
// 	async (request: AuthenticatedRequest, response: Response) => {
// 		// const userId = request.auth?.userId;
// 		const callId = request.params.id;
// 		const status = request.query.status;

// 		if (typeof status === 'string') {
// 			try {
// 				const updateCallStatus = prisma.call.update({
// 					where: {
// 						id: callId,
// 					},
// 					data: {
// 						status: 'MISSED',
// 					},
// 				});
// 				return response
// 					.status(200)
// 					.json(new ApiResponse(200, updateCallStatus));
// 			} catch (error) {
// 				console.log(error);
// 				return response
// 					.status(400)
// 					.json(new ApiError(400, 'Error Happened', error));
// 			}
// 		}
// 	}
// );

export const callConnected = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		const userId = request.auth?.userId;
		const callId = request.params.callId;

		const status = request.query.status;

		if (typeof status === 'string') {
			try {
				const updateCallStatus = prisma.call.update({
					where: {
						id: callId,
						receiverId: userId,
					},
					data: {
						status: 'COMPLETED',
					},
				});
				return response
					.status(200)
					.json(new ApiResponse(200, updateCallStatus));
			} catch (error) {
				console.log(error);
				return response
					.status(400)
					.json(new ApiError(400, 'Error Happened', error));
			}
		}
	}
);

export const callMissed = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		const userId = request.auth?.userId;
		const callId = request.params.callId;
		const status = request.query.status;

		if (typeof status === 'string') {
			try {
				const updateCallStatus = prisma.call.update({
					where: {
						id: callId,
						callerId: userId,
					},
					data: {
						status: 'MISSED',
					},
				});
				return response
					.status(200)
					.json(new ApiResponse(200, updateCallStatus));
			} catch (error) {
				console.log(error);
				return response
					.status(400)
					.json(new ApiError(400, 'Error Happened', error));
			}
		}
	}
);

export const callNoAnswer = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		const userId = request.auth?.userId;
		const callId = request.params.callId;
		const status = request.query.status;

		if (typeof status === 'string') {
			try {
				const updateCallStatus = prisma.call.update({
					where: {
						id: callId,
						OR: [
							{
								callerId: userId,
							},
							{
								receiverId: userId,
							},
						],
					},
					data: {
						status: 'NOANSWER',
					},
				});
				return response
					.status(200)
					.json(new ApiResponse(200, updateCallStatus));
			} catch (error) {
				console.log(error);
				return response
					.status(400)
					.json(new ApiError(400, 'Error Happened', error));
			}
		}
	}
);

export const callRejected = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		const userId = request.auth?.userId;
		const callId = request.params.callId;
		const status = request.query.status;

		if (typeof status === 'string') {
			try {
				const updateCallStatus = prisma.call.update({
					where: {
						id: callId,
						receiverId: userId,
					},
					data: {
						status: 'REJECTED',
					},
				});
				return response
					.status(200)
					.json(new ApiResponse(200, updateCallStatus));
			} catch (error) {
				console.log(error);
				return response
					.status(400)
					.json(new ApiError(400, 'Error Happened', error));
			}
		}
	}
);
