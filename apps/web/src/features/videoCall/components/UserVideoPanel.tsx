'use client';
import useStreamStore from '@/store/useStreamStore';
import React, { useEffect, useRef } from 'react';

const UserVideoPanel = () => {
	const localStream = useStreamStore((state) => state.localStream);
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const video = videoRef.current;
		if (video && localStream) {
			video.srcObject = localStream;
			video.play().catch((error) => {
				console.error('Error playing video:', error);
			});
		}

		return () => {
			if (video) {
				video.srcObject = null;
			}
		};
	}, [localStream]);

	return (
		<div className="relative z-20 flex h-full w-full rounded-xl">
			<div className="relative z-30 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl bg-[#3c4043]">
				<video
					ref={videoRef}
					autoPlay
					playsInline
					muted
					className="h-full w-full object-cover"
				/>
			</div>
		</div>
	);
};

export default UserVideoPanel;
