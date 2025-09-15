import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { nanoid } from 'nanoid';
import prisma from '../lib/prismaClient';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';
import { getAuth } from '@clerk/express';

export const createInstantRoom = asyncHandler(
	async (request: Request, response: Response) => {
		const { userId } = getAuth(request);

		if (!userId) {
			response
				.status(401)
				.json(new ApiError(401, 'Unauthorized: missing userId'));
		}

		const shortId = nanoid(8);

		console.log('User Id========>>', userId);

		try {
			const meetingDetails = await prisma.room.create({
				data: {
					id: shortId,
					title: 'Instant Meeting',
					description: `This is Instant Meeting. Created by ${userId} `,
					type: 'INSTANT',
					url: `${process.env.FRONTEND_URL!}/room/${shortId}`,
					createdById: userId!,
					hostById: userId!,
					startTime: new Date(),
				},
				select: {
					id: true,
					title: true,
					type: true,
					url: true,
					createdBy: true,
					startTime: true,
				},
			});

			console.log('meetingDetails', meetingDetails);
			response.status(200).json(new ApiResponse(200, meetingDetails));
		} catch (error) {
			console.log(error);
			response.status(400).json(new ApiError(400, 'Error Happened', error));
		}
	}
);

export const getAllRooms = asyncHandler(
	async (request: Request, response: Response) => {
		const { userId } = getAuth(request);
		const roomId = request.query.roomId;

		if (typeof roomId === 'string') {
			try {
				const meetingData = await prisma.room.findUnique({
					where: {
						id: roomId,
						type: 'INSTANT',
					},
					select: {
						id: true,
						type: true,
						url: true,
						title: true,
						createdBy: {
							select: {
								id: true,
								image_url: true,
								first_name: true,
							},
						},
						description: true,
						startTime: true,
						createdById: true,
						createdAt: true,
					},
				});

				response.status(200).json(new ApiResponse(200, meetingData));
			} catch (error) {
				response
					.status(400)
					.json(new ApiError(400, 'Error While getting a Call', error));
			}
		} else {
			try {
				const rooms = await prisma.room.findMany({
					where: {
						type: 'INSTANT',
						OR: [
							{
								createdById: userId!,
							},
							{
								participants: {
									some: {
										user_id: userId!,
									},
								},
							},
						],
					},
					select: {
						id: true,
						type: true,
						url: true,
						title: true,
						createdBy: {
							select: {
								id: true,
								image_url: true,
								first_name: true,
								last_name: true,
							},
						},
						description: true,
						startTime: true,
						createdById: true,
						createdAt: true,
						participants: {
							select: {
								user: true,
							},
						},
					},
				});

				const ModifyRoomDetails = rooms.map((room) => {
					return {
						id: room.id,
						type: room.type,
						url: room.url,
						title: room.title,
						createdBy: room.createdBy,
						description: room.description,
						startTime: room.startTime,
						createdById: room.createdById,
						createdAt: room.createdAt,
						participants: room.participants.map((item) => item.user),
					};
				});

				// console.log('Meeting Data==========>', ModifyRoomDetails);
				return response
					.status(200)
					.json(new ApiResponse(200, ModifyRoomDetails));
			} catch (error) {
				return response
					.status(400)
					.json(new ApiError(400, 'Error Happened', error));
			}
		}
	}
);

// export const getRoomDetails = asyncHandler(
// 	async (request: AuthenticatedRequest, response: Response) => {
// 		const roomId = request.params.roomId;

// 		try {
// 			const meetingData = await prisma.room.findUnique({
// 				where: {
// 					type: 'INSTANT',
// 					roomId: roomId,
// 				},
// 				select: {
// 					id: true,
// 					type: true,
// 					roomId: true,
// 					url: true,
// 					title: true,
// 					createdBy: {
// 						select: {
// 							id: true,
// 							image_url: true,
// 							first_name: true,
// 						},
// 					},
// 					description: true,
// 					startTime: true,
// 					createdById: true,
// 					createdAt: true,
// 				},
// 			});

// 			return response.status(200).json(new ApiResponse(200, meetingData));
// 		} catch (error) {
// 			return response
// 				.status(400)
// 				.json(new ApiError(400, 'Error While getting a Call', error));
// 		}
// 	}
// );

export const createScheduleCall = asyncHandler(
	async (request: Request, response: Response) => {
		const { userId } = getAuth(request);
		const shortId = nanoid(8);
		const { title, description, startTime, endTime, participantIds } =
			request.body;
		console.log(request.body);

		try {
			if (!userId) {
				response
					.status(401)
					.json(new ApiError(401, 'Unauthorized: missing userId'));
			}

			// Normalize participants list to an array of objects with user_id
			const inviteUserIds: string[] = Array.isArray(participantIds)
				? participantIds
				: participantIds
					? [participantIds]
					: [userId];

			const meetingDetails = await prisma.room.create({
				data: {
					id: shortId,
					type: 'SCHEDULE',
					title,
					description,
					startTime,
					endTime,
					createdById: userId!,
					hostById: userId!,
					invitedUsers: {
						createMany: {
							data: inviteUserIds.map((id: string) => ({ user_id: id })),
						},
					},
					url: `${process.env.FRONTEND_URL!}/room/${shortId}`,
				},
			});

			console.log(meetingDetails);

			response.status(200).json(new ApiResponse(200, meetingDetails));
		} catch (error) {
			console.log(error);
			response.status(400).json(new ApiError(400, 'Error Happened', error));
		}
	}
);

export const getAllScheduledRoomsDetails = asyncHandler(
	async (request: Request, response: Response) => {
		const { userId } = getAuth(request);

		console.log('Schedule Rooms---->>>');
		try {
			const rooms = await prisma.room.findMany({
				where: {
					type: 'SCHEDULE',
					createdById: userId!,
				},
				select: {
					id: true,
					type: true,
					url: true,
					title: true,
					createdBy: {
						select: {
							id: true,
							image_url: true,
							first_name: true,
							last_name: true,
						},
					},
					description: true,
					startTime: true,
					createdById: true,
					createdAt: true,
				},
			});

			console.log('Schedule Rooms---->>>', rooms);

			return response.status(200).json(new ApiResponse(200, rooms));
		} catch (error) {
			return response
				.status(400)
				.json(new ApiError(400, 'Error Happened', error));
		}
	}
);

export const updateScheduledRoom = asyncHandler(
	async (request: Request, response: Response) => {
		const { roomId, title, description, startTime, endTime, participants } =
			request.body;
		const { userId } = getAuth(request);

		try {
			const updatedRoom = await prisma.room.update({
				where: {
					type: 'SCHEDULE',
					id: roomId,
					createdById: userId!,
				},
				data: {
					title,
					description,
					startTime,
					endTime,
					participants,
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
	async (request: Request, response: Response) => {
		// const roomId = request.params.roomId;
		const roomId = request.query.roomId;
		console.log(roomId);

		if (typeof roomId === 'string') {
			try {
				const deleteRoom = await prisma.room.delete({
					where: {
						type: 'SCHEDULE',
						id: roomId,
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

export const getScheduledRoom = asyncHandler(
	async (request: Request, response: Response) => {
		const roomId = request.params.roomId;

		try {
			const rooms = await prisma.room.findUnique({
				where: {
					type: 'SCHEDULE',
					id: roomId,
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
