interface RoomDetails {
	id: string;
	type: $Enums.RoomType;
	roomId: string;
	url: string;
	title: string;
	description: string | null;
	startTime: Date | null;
	endTime: Date | null;
	createdById: string;
	createdBy: {
		id: string;
		image_url: string;
		first_name: string;
		last_name: string;
	};
	participantIds: string[];
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
