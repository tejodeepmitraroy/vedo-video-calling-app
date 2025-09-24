import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import prisma from '../lib/prismaClient';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';

import { clerkClient, getAuth } from '@clerk/express';

export const findAUser = asyncHandler(
	async (request: Request, response: Response) => {
		// Use `getAuth()` to get the user's `userId`
		const { userId } = getAuth(request);

		// Use Clerk's JavaScript Backend SDK to get the user's User object
		const user = await clerkClient.users.getUser(userId!);
		const userName = request.query.user;

		console.log('user=======>>>>>', user);
		if (typeof userName === 'string') {
			try {
				const users = await prisma.user.findMany({
					where: {
						OR: [
							{
								email: {
									startsWith: userName,
								},
							},
							{
								firstName: {
									startsWith: userName,
								},
							},
							{
								lastName: {
									startsWith: userName,
								},
							},
						],

						// email: {
						// 	startsWith: `+${userName}`,
						// },
						// email: {
						// 	startsWith: userName,
						// },
						// first_name: {
						// 	startsWith: userName,
						// },
						// last_name: {
						// 	startsWith: `+${userName}`,
						// },
					},
					select: {
						id: true,
						firstName: true,
						lastName: true,
						email: true,
						imageUrl: true,
						createdAt: true,
						updatedAt: true,
						friendOf: {
							include: {
								user: {
									select: {
										id: true,
										firstName: true,
										lastName: true,
										email: true,
										imageUrl: true,
										createdAt: true,
										updatedAt: true,
										// friends: {
										// 	include: {
										// 		friend: true,
										// 	},
										// },
									},
								},
							},
						},
						friends: {
							include: {
								friend: {
									select: {
										id: true,
										// first_name: true,
										// last_name: true,
										// email: true,
										// image_url: true,
										// createdAt: true,
										// updatedAt: true,
										// friendOf: {
										// 	include: {
										// 		user: true,
										// 	},
										// },
									},
								},
							},
						},
					},
				});

				const filteredUser = users.filter((item) => item.id !== user.id);

				const result = filteredUser.map((item) => {
					const friend = item.friends.map((item) => {
						return item.friend.id === user.id;
					});
					const friendOf = item.friendOf.map((item) => {
						return item.user.id === user.id;
					});

					const friendShip = [...friend, ...friendOf];

					return {
						id: item.id,
						firstName: item.firstName,
						lastName: item.lastName,
						email: item.email,
						imageUrl: item.imageUrl,
						friendShip: friendShip.length === 1,
						createdAt: item.createdAt,
						updatedAt: item.updatedAt,
					};
				});

				response.status(200).json(new ApiResponse(200, result));
			} catch (error) {
				response
					.status(400)
					.json(new ApiError(400, 'Error While getting a Call', error));
			}
		} else {
			response
				.status(400)
				.json(new ApiError(400, 'Query Parameter is invalid'));
		}
	}
);

export const getAllFriendList = asyncHandler(
	async (request: Request, response: Response) => {
		const { userId } = getAuth(request);
		// Use Clerk's JavaScript Backend SDK to get the user's User object
		const user = await clerkClient.users.getUser(userId!);
		console.log('user=======>>>>>', user);
		try {
			const friends = await prisma.user.findUnique({
				where: {
					id: userId!,
				},
				select: {
					friends: {
						include: {
							friend: {
								select: {
									id: true,
									firstName: true,
									lastName: true,
									email: true,
									imageUrl: true,
									createdAt: true,
									updatedAt: true,
									friendOf: {
										include: {
											user: true,
										},
									},
								},
							},
						},
					},

					friendOf: {
						include: {
							user: {
								select: {
									id: true,
									firstName: true,
									lastName: true,
									email: true,
									imageUrl: true,
									createdAt: true,
									updatedAt: true,
									friends: {
										include: {
											friend: true,
										},
									},
								},
							},
						},
					},
				},
			});

			if (friends) {
				console.log('friend =====>', friends);
				const friend = friends.friends.map((item) => {
					const friendship = item.friend.friendOf.map(
						(item) => item.user.id === userId
					);
					return {
						id: item.friend.id,
						firstName: item.friend.firstName,
						lastName: item.friend.lastName,
						email: item.friend.email,
						imageUrl: item.friend.imageUrl,
						friendShip: friendship.map((item) => item === true),
						createdAt: item.friend.createdAt,
						updatedAt: item.friend.updatedAt,
					};
				});
				const friendOf = friends.friendOf.map((item) => {
					const friendship = item.user.friends.map(
						(item) => item.friend.id === userId
					);

					console.log('friendOf =====>', item.user.friends);
					return {
						id: item.user.id,
						firstName: item.user.firstName,
						lastName: item.user.lastName,
						email: item.user.email,
						imageUrl: item.user.imageUrl,
						friendShip: friendship.map((item) => item === true),
						createdAt: item.user.createdAt,
						updatedAt: item.user.updatedAt,
					};
				});
				const friendList = [...friend, ...friendOf];

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
	async (request: Request, response: Response) => {
		const { friendId } = request.body;
		const { userId } = getAuth(request);

		console.log('friendId=======>>>>>', friendId);

		try {
			const friend = await prisma.friendShip.create({
				data: {
					userId: userId!,
					friendId: friendId,
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

export const removeFriend = asyncHandler(
	async (request: Request, response: Response) => {
		const friendId = request.query.friendId;

		const { userId } = getAuth(request);
		console.log('friendId=======>>>>>', friendId);

		if (typeof userId === 'string' && typeof friendId === 'string') {
			try {
				const friend = await prisma.friendShip.deleteMany({
					where: {
						OR: [
							{
								userId: userId!,
								friendId: friendId,
							},
							{
								userId: friendId,
								friendId: userId!,
							},
						],
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
	}
);
