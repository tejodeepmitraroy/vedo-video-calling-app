"use client"
import axios from 'axios';

export const handleInstantCreateCall = async (token: string) => {
	
	console.log('Token---->', token);

	try {
		const { data } = await axios.post(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/call/createInstantCall`,
			{},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			}
		);
		console.log(data.data.videoCallUrl);
		const videoCallUrl = data.data.videoCallUrl;

		window.location.href = videoCallUrl;
	} catch (error) {
		console.log(error);
	}
};

const handleCreateScheduleCall = async (
	token: string,
	{
		title,
		description,
		startTime,
		endTime,
		participantIds,
	}: {
		title: string;
		description: string;
		startTime: Date;
		endTime: Date;
		participantIds: string[];
	}
) => {
	try {
		const { data } = await axios.post(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/call/createScheduleCall`,
			{
				title,
				description,
				startTime,
				endTime,
				participantIds,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			}
		);
		console.log(data);
	} catch (error) {
		console.log(error);
	}
};
