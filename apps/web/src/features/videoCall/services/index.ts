import { customAxios } from '@/services/api-custom';

export const createInstantCall = async (token: string | null) => {
	const response = await customAxios(token).post(`/room`);

	return response.data.data as RoomDetails;
};

export const getRoomDetails = async (token: string | null, roomId: string) => {
	const response = await customAxios(token).get(`/room?roomId=${roomId}`);

	return response.data.data as RoomDetails;
};
