'use client';
import { useRoomStore } from '@/store/useStore';
import React, { FC, useCallback, useState } from 'react';
import ReactPlayer from 'react-player';

interface VideoPanelProps {
	stream: MediaStream | null;
	muted:boolean
}
const VideoPanel: FC<VideoPanelProps> = ({ stream,muted }) => {
	// const [streamMedia, getStreamMedia] = useState<MediaStream>();

	// const getUserMediaStream = useCallback(async () => {
	// 	try {
	// 		const stream = await navigator.mediaDevices.getUserMedia({
	// 			video: true,
	// 			audio: true,
	// 		});

	// 		console.log(stream);

	// 		getStreamMedia(stream);
	// 	} catch (error) {
	// 		console.error('Error opening video camera.', error);
	// 	}
	// }, []);

	// React.useEffect(() => {
	// 	getUserMediaStream();
	// }, [getUserMediaStream]);

	return (
		<ReactPlayer
			url={stream!}
			playing
			muted={muted}
			playsInline
			width="320"
			height="240"
			className="aspect-video h-full w-full rounded-3xl"
		/>
	);
};

export default VideoPanel;
