import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import prisma from '../lib/prismaClient';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';
import { AuthenticatedRequest } from '../types/apiRequest';

export const findAUser = asyncHandler(
	async (request: Request, response: Response) => {
		const userName = request.query.user;

		if (typeof userName === 'string') {
			try {
				const user = await prisma.user.findMany({
					where: {
						OR: [
							{
								email: {
									search: userName,
								},
							},
							{
								first_name: {
									search: userName,
								},
							},
							{
								last_name: {
									search: userName,
								},
							},
						],
						// email: {
						// 	search: `+${userName}`,
						// },
						// first_name: {
						// 	search: `+${userName}`,
						// },
						// last_name: {
						// 	search: `+${userName}`,
						// },
					},
				});
				return response.status(200).json(new ApiResponse(200, user));
			} catch (error) {
				return response
					.status(400)
					.json(new ApiError(400, 'Error While getting a Call', error));
			}
		} else {
			return response
				.status(400)
				.json(new ApiError(400, 'Query Parameter is invalid'));
		}
	}
);

export const getAllFriendList = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		const user = request.auth?.userId;
		try {
			const friends = await prisma.user.findUnique({
				where: {
					id: user,
				},
				select: {
					friends: {
						include: {
							friend: true,
						},
					},
					friendOf: {
						include: {
							user: true,
						},
					},
				},
			});

			if (friends) {
				const friendList = [
					...friends.friends.map((item) => item.friend),
					...friends.friendOf.map((friend) => friend.user),
				];
				console.log('friendList=======>>>>>', friendList);
				return response.status(200).json(new ApiResponse(200, friendList));
			} else {
				return response.status(200).json(new ApiResponse(200, []));
			}
		} catch (error) {
			console.log(error);
			return response
				.status(400)
				.json(new ApiError(400, 'Error Happened', error));
		}
	}
);
export const sendFriendRequest = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		const { friendId } = request.body;

		const user = request.auth?.userId;
		console.log('friendId=======>>>>>', friendId);

		try {
			const friend = await prisma.friendShip.create({
				data: {
					user_id: user,
					friend_id: friendId,
				},
			});

			console.log('friend=======>>>>>', friend);
			return response.status(200).json(new ApiResponse(200, friend));
		} catch (error) {
			console.log(error);
			return response
				.status(400)
				.json(new ApiError(400, 'Error Happened', error));
		}
	}
);
