import { Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import prisma from '../lib/prismaClient';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';
import { AuthenticatedRequest } from '../types/apiRequest';

export const findAUser = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		const userName = request.query.user;
		const user = request.auth?.userId;
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
								first_name: {
									startsWith: userName,
								},
							},
							{
								last_name: {
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
						first_name: true,
						last_name: true,
						email: true,
						image_url: true,
						createdAt: true,
						updatedAt: true,
						friendOf: {
							include: {
								user: {
									select: {
										id: true,
										// first_name: true,
										// last_name: true,
										// email: true,
										// image_url: true,
										// createdAt: true,
										// updatedAt: true,
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

				const filteredUser = users.filter((item) => item.id !== user);

				const result = filteredUser.map((item) => {
					const friend = item.friends.map((item) => {
						return item.friend.id === user;
					});
					const friendOf = item.friendOf.map((item) => {
						return item.user.id === user;
					});

					const friendShip = [...friend, ...friendOf];

					return {
						id: item.id,
						first_name: item.first_name,
						last_name: item.last_name,
						email: item.email,
						image_url: item.image_url,
						friendShip: friendShip.length === 1,
						createdAt: item.createdAt,
						updatedAt: item.updatedAt,
					};
				});

				return response.status(200).json(new ApiResponse(200, result));
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
		console.log('user=======>>>>>', user);
		try {
			const friends = await prisma.user.findUnique({
				where: {
					id: user,
				},
				select: {
					friends: {
						include: {
							friend: {
								select: {
									id: true,
									first_name: true,
									last_name: true,
									email: true,
									image_url: true,
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
									first_name: true,
									last_name: true,
									email: true,
									image_url: true,
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
						(item) => item.user.id === user
					);
					return {
						id: item.friend.id,
						first_name: item.friend.first_name,
						last_name: item.friend.last_name,
						email: item.friend.email,
						image_url: item.friend.image_url,
						friendShip: friendship.map((item) => item === true),
						createdAt: item.friend.createdAt,
						updatedAt: item.friend.updatedAt,
					};
				});
				const friendOf = friends.friendOf.map((item) => {
					const friendship = item.user.friends.map(
						(item) => item.friend.id === user
					);

					console.log('friendOf =====>', item.user.friends);
					return {
						id: item.user.id,
						first_name: item.user.first_name,
						last_name: item.user.last_name,
						email: item.user.email,
						image_url: item.user.image_url,
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
export const removeFriend = asyncHandler(
	async (request: AuthenticatedRequest, response: Response) => {
		const friendId = request.query.friendId;

		const user = request.auth?.userId;
		console.log('friendId=======>>>>>', friendId);

		if (typeof user === 'string' && typeof friendId === 'string') {
			try {
				const friend = await prisma.friendShip.deleteMany({
					where: {
						OR: [
							{
								user_id: user,
								friend_id: friendId,
							},
							{
								user_id: friendId,
								friend_id: user,
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
