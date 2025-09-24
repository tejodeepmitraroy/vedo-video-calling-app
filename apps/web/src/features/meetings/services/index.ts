import { customAxios } from '@/services/api-custom';

export const getAllRoomDetails = async (token: string | null) => {
	const response = await customAxios(token).get(`/room`);

	return response.data.data as RoomDetails[];
};
