import React from 'react';

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

interface MeetingItemProps {
	meeting: RoomDetails;
}

const MeetingItem: React.FC<MeetingItemProps> = ({ meeting }) => {
	const formatDateTime = (dateInput: string | Date) => {
		try {
			const date = new Date(dateInput);
			if (isNaN(date.getTime())) {
				return 'Invalid Date';
			}
			return new Intl.DateTimeFormat('en-US', {
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			}).format(date);
		} catch (error) {
			return 'Invalid Date';
		}
	};

	const formatDuration = (
		startTimeInput: string | Date,
		endTimeInput: string | Date | null
	) => {
		try {
			const startTime = new Date(startTimeInput);
			if (isNaN(startTime.getTime())) {
				return 'Invalid Date';
			}

			if (!endTimeInput) return 'Ongoing';

			// Type assertion to tell TypeScript that endTimeInput is not null after the check
			const endTime = new Date(endTimeInput as string | Date);
			if (isNaN(endTime.getTime())) {
				return 'Invalid Date';
			}

			const duration = Math.round(
				(endTime.getTime() - startTime.getTime()) / (1000 * 60)
			);
			return `${duration} min`;
		} catch (error) {
			return 'Invalid Date';
		}
	};

	return (
		<div className="flex items-center justify-between gap-5 border-b border-gray-100 p-4 transition-colors hover:bg-gray-50">
			<div className="flex-1">
				<h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
				<p className="text-sm text-gray-600">ID: {meeting.shortId}</p>
				{meeting.description && (
					<p className="mt-1 text-sm text-gray-500">{meeting.description}</p>
				)}
			</div>
			<div className="text-right">
				<p className="font-medium text-gray-900">
					{formatDateTime(meeting.startTime)}
				</p>
				<p className="text-sm text-gray-500">
					{formatDuration(meeting.startTime, meeting.endTime)}
				</p>
			</div>
		</div>
	);
};

export default MeetingItem;
