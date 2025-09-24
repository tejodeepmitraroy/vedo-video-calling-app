import React from 'react';
import MeetingItem from './MeetingItem';

interface RoomDetails {
	id: string;
	type: string;
	shortId: string;
	title: string;
	description: string | null;
	startTime: string | Date;
	endTime: string | Date | null;
	createdById: string;
	createdBy: {
		id: string;
		first_name: string;
		last_name: string;
		email: string;
		image_url: string;
	};
	participants: any[];
	createdAt: string | Date | null;
	updatedAt: string | Date | null;
}

interface MeetingsListProps {
	meetings: RoomDetails[];
}

const MeetingsList: React.FC<MeetingsListProps> = ({ meetings }) => {
	return (
		<div className="flex flex-col gap-5 border border-gray-200">
			{meetings.length === 0 ? (
				<p className="text-center text-gray-500">No meetings scheduled</p>
			) : (
				meetings.map((meeting) => (
					<MeetingItem key={meeting.id} meeting={meeting} />
				))
			)}
		</div>
	);
};

export default MeetingsList;
