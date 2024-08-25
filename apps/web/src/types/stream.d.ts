interface MeetingDetails {
	createdAt: Date;
	createdById: string;
	description: string | null;
	endTime: Date | null;
	id: string;
	meetingId: string;
	participantIds: string[];
	startTime: Date | null;
	title: string;
	updatedAt: Date;
	videoCallUrl: string;
}

interface ServerStoreUser {
	socketId: string;
	userId: string;
	fullName: string;
	imageUrl: string;
	emailAddress: string;
	host: boolean;
}
