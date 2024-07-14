import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import prisma from '../lib/prismaClient';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';

export const findAUser = asyncHandler(
	async (request: Request, response: Response) => {
		const userName = request.params.userName;
		try {
			const user = await prisma.user.findMany({
				where: {
					email: {
						search: `+${userName}`,
					},
					first_name: {
						search: `+${userName}`,
					},
					last_name: {
						search: `+${userName}`,
					},
				},
			});
			return response.status(200).json(new ApiResponse(200, user));
		} catch (error) {
			return response
				.status(400)
				.json(new ApiError(400, 'Error While getting a Call', error));
		}
	}
);

export const getFriendList = asyncHandler(
	async (request: Request, response: Response) => {
		console.log(request, response);
	}
);
export const sendFriendRequest = asyncHandler(
	async (request: Request, response: Response) => {
		console.log(request, response);
	}
);
