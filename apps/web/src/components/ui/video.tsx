'use client';
import React, { FC } from 'react';
import ReactPlayer from 'react-player';

const MeetingVideo = () => {
	const [streamMedia, getStreamMedia] = React.useState<MediaStream>();

	const getUserMediaStream = React.useCallback(async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});

			console.log(stream);

			getStreamMedia(stream);
		} catch (error) {
			console.error('Error opening video camera.', error);
		}
	}, []);

	React.useEffect(() => {
		getUserMediaStream();
	}, [getUserMediaStream]);
	return (
		<div className="aspect-video h-full w-full rounded-3xl border border-white">
			<ReactPlayer
				url={streamMedia}
				playing
				muted
				width="320"
				height="240"
				className="h-full w-full"
			/>
		</div>
	);
};

export default MeetingVideo;
