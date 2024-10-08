interface User {
	createdAt: string;
	email: string;
	first_name: string;
	id: string;
	image_url: string;
	last_name: string;
	updatedAt: Date | null;
}
interface RoomDetails {
	id: string;
	type: string;
	roomId: string;
	url: string;
	title: string;
	description: string | null;
	startTime: Date;
	endTime: Date | null;
	createdById: string;
	createdBy: User;
	participants: User[];
	createdAt: Date | null;
	updatedAt: Date | null;
}

interface ApiResponse {
	statusCode: number;
	data: RoomDetails[];
	message: string;
	success: boolean;
}

interface FriendListResponse {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	image_url: string;
	friendShip: boolean;
	createdAt: Date | null;
	updatedAt: Date | null;
}
