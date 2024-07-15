import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { nanoid } from 'nanoid';
import prisma from '../lib/prismaClient';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';
import { WithAuthProp } from '@clerk/clerk-sdk-node';

interface ClerkUser {
	id: string;
	firstName: string;
	lastName: string;
	emailAddresses: { id: string; emailAddress: string }[];
	// Add other Clerk user properties if needed
}

// declare global {
//   namespace Express {
//     interface Request {
//       // auth?: {
//       //   user: ClerkUser;
//       // };

//       auth: WithAuthProp;
//     }
//   }
// }

interface ClerkUser {
	userId: string;
	firstName: string;
	lastName: string;
	emailAddresses: { id: string; emailAddress: string }[];
	// Add other Clerk user properties if needed
}

export interface AuthenticatedRequest extends Request {
	auth?: WithAuthProp<ClerkUser>;
}

export const createInstantRoom = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		const user = request.auth?.userId;
		const shortId = nanoid(8);

		try {
			const meetingDetails = await prisma.room.create({
				data: {
					title: 'Instant Meeting',
					type: 'INSTANT',
					roomId: shortId,
					url: `${process.env.FRONTEND_URL!}/room/${shortId}`,
					createdById: user!,
					startTime: new Date().toISOString(),
					participantIds: [user!],
				},
			});

			console.log('meetingDetails', meetingDetails);
			return response.status(200).json(new ApiResponse(200, meetingDetails));
		} catch (error) {
			console.log(error);
			return response
				.status(400)
				.json(new ApiError(400, 'Error Happened', error));
		}
	}
);

export const getAllRooms = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		const userId = request.auth?.id;

		try {
			const rooms = await prisma.room.findMany({
				where: {
					type: 'INSTANT',
					createdById: userId!,
				},
			});
			return response.status(200).json(new ApiResponse(200, rooms));
		} catch (error) {
			return response
				.status(400)
				.json(new ApiError(400, 'Error Happened', error));
		}
	}
);

export const getRoomDetails = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		const roomId = request.params.roomId;

		try {
			const meetingData = await prisma.room.findUnique({
				where: {
					type: 'INSTANT',
					roomId: roomId,
				},
			});

			return response.status(200).json(new ApiResponse(200, meetingData));
		} catch (error) {
			return response
				.status(400)
				.json(new ApiError(400, 'Error While getting a Call', error));
		}
	}
);

export const createScheduleCall = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		const user = request.auth?.userId;
		const shortId = nanoid(8);
		const { title, description, startTime, endTime, participantIds } =
			request.body;
		console.log(request.body);

		try {
			const meetingDetails = await prisma.room.create({
				data: {
					type: 'SCHEDULE',
					title,
					description,
					startTime,
					endTime,
					participantIds: participantIds ? participantIds : [user!],
					roomId: shortId,
					url: `${process.env.FRONTEND_URL!}/room/${shortId}`,
					createdById: user!,
				},
			});

			console.log(meetingDetails);

			return response.status(200).json(new ApiResponse(200, meetingDetails));
		} catch (error) {
			console.log(error);
			return response
				.status(400)
				.json(new ApiError(400, 'Error Happened', error));
		}
	}
);

export const getScheduledRoom = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		const userId = request.auth?.id;
		const roomId = request.query.roomId;

		if (typeof roomId === 'string') {
			try {
				const rooms = await prisma.room.findUnique({
					where: {
						type: 'SCHEDULE',
						roomId: roomId,
					},
				});
				return response.status(200).json(new ApiResponse(200, rooms));
			} catch (error) {
				return response
					.status(400)
					.json(new ApiError(400, 'Error Happened', error));
			}
		} else {
			try {
				const rooms = await prisma.room.findMany({
					where: {
						type: 'SCHEDULE',
						createdById: userId!,
					},
				});
				return response.status(200).json(new ApiResponse(200, rooms));
			} catch (error) {
				return response
					.status(400)
					.json(new ApiError(400, 'Error Happened', error));
			}
		}
	}
);

export const updateScheduledRoom = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		const { roomId, title, description, startTime, endTime, participantIds } =
			request.body;
		const userId = request.auth?.id;

		try {
			const updatedRoom = await prisma.room.update({
				where: {
					type: 'SCHEDULE',
					roomId: roomId,
					createdById: userId,
				},
				data: {
					title,
					description,
					startTime,
					endTime,
					participantIds,
				},
			});

			return response.status(200).json(new ApiResponse(200, updatedRoom));
		} catch (error) {
			return response
				.status(400)
				.json(new ApiError(400, 'Error Happened', error));
		}
	}
);

export const deleteScheduledRoom = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		// const roomId = request.params.roomId;
		const roomId = request.query.roomId;
		console.log(roomId);

		if (typeof roomId === 'string') {
			try {
				const deleteRoom = await prisma.room.delete({
					where: {
						type: 'SCHEDULE',
						roomId,
					},
				});

				return response.status(200).json(new ApiResponse(200, deleteRoom));
			} catch (error) {
				return response
					.status(400)
					.json(new ApiError(400, 'Error Happened', error));
			}
		} else {
			return response
				.status(400)
				.json(new ApiError(400, 'Query Parameter is invalid'));
		}
	}
);

// export const getScheduledRoom = asyncHandler(
// 	async (request: AuthenticatedRequest, response: Response) => {
// 		const roomId = request.params.roomId;
// 		console.log(roomId);
// 		console.log(response);

// 		try {
// 			const rooms = await prisma.room.findUnique({
// 				where: {
// 					type: 'SCHEDULE',
// 					roomId: roomId,
// 				},
// 			});
// 			return response.status(200).json(new ApiResponse(200, rooms));
// 		} catch (error) {
// 			return response
// 				.status(400)
// 				.json(new ApiError(400, 'Error Happened', error));
// 		}
// 	}
// );
