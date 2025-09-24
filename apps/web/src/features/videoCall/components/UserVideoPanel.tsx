'use client';
import useStreamStore from '@/store/useStreamStore';
import React, { useEffect, useMemo, useState } from 'react';
import ReactPlayer from 'react-player';

const UserVideoPanel = () => {
	const localStream = useStreamStore((state) => state.localStream);

	const [hasWindow, setHasWindow] = useState(false);
	const [streamKey, setStreamKey] = useState(0);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setHasWindow(true);
		}
	}, []);

	// Force ReactPlayer to re-render when stream changes
	useEffect(() => {
		if (localStream) {
			console.log('UserVideoPanel: Stream changed, updating key');
			setStreamKey((prev) => prev + 1);
		}
	}, [localStream]);

	// Create a stable URL from the stream
	const streamUrl = useMemo(() => {
		if (!localStream) return null;
		return localStream;
	}, [localStream]);

	//   const isMounted = useRef(true);

	// useEffect(() => {
	// 	const video = videoRef.current;
	// 	if (!video || !localStream) {
	// 		console.log('UserVideoPanel: No video element or no local stream');
	// 		return;
	// 	}

	// 	// Only update if the stream has actually changed
	// 	if (video.srcObject !== localStream) {
	// 		console.log('UserVideoPanel: Setting new stream to video element');
	// 		console.log('UserVideoPanel: Previous srcObject:', video.srcObject);
	// 		console.log('UserVideoPanel: New srcObject:', localStream);

	// 		// Stop any existing tracks before setting new stream
	// 		if (video.srcObject) {
	// 			const previousStream = video.srcObject as MediaStream;
	// 			previousStream.getTracks().forEach((track) => {
	// 				track.stop();
	// 			});
	// 		}

	// 		video.srcObject = localStream;

	// 		// Ensure video is playing with better error handling
	// 		const playVideo = async () => {
	// 			try {
	// 				// Check if video is already playing or if there's a pending play request
	// 				if (video.readyState >= 2) {
	// 					// HAVE_CURRENT_DATA or higher
	// 					console.log('UserVideoPanel: Video ready, attempting to play');
	// 					await video.play();
	// 					console.log('UserVideoPanel: Video playing successfully');
	// 				} else {
	// 					console.log(
	// 						'UserVideoPanel: Video not ready, waiting for canplay event'
	// 					);
	// 					// Wait for the video to be ready
	// 					const handleCanPlay = () => {
	// 						video.removeEventListener('canplay', handleCanPlay);
	// 						video.play().catch((error) => {
	// 							console.error(
	// 								'UserVideoPanel: Error playing video after canplay:',
	// 								error
	// 							);
	// 						});
	// 					};
	// 					video.addEventListener('canplay', handleCanPlay);
	// 				}
	// 			} catch (error: any) {
	// 				if (
	// 					error.name === 'AbortError' ||
	// 					error.message.includes('interrupted')
	// 				) {
	// 					console.warn(
	// 						'UserVideoPanel: Play request was interrupted, this is normal:',
	// 						error.message
	// 					);
	// 				} else {
	// 					console.error('UserVideoPanel: Error playing video:', error);
	// 				}
	// 			}
	// 		};

	// 		playVideo();
	// 	} else {
	// 		console.log('UserVideoPanel: Stream unchanged, no update needed');
	// 	}

	// 	// Check if video tracks are enabled
	// 	const videoTracks = localStream.getVideoTracks();
	// 	if (videoTracks.length > 0) {
	// 		console.log(
	// 			'UserVideoPanel: Video track enabled:',
	// 			videoTracks[0].enabled,
	// 			'readyState:',
	// 			videoTracks[0].readyState
	// 		);
	// 	}

	// 	return () => {
	// 		if (video) {
	// 			video.srcObject = null;
	// 		}
	// 	};
	// }, [localStream]);

	// console.log('UserVideoPanel: localStream------------------->', localStream);
	return (
		<div className="relative z-20 flex h-full w-full rounded-xl">
			<div className="relative z-30 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl bg-[#3c4043]">
				{hasWindow && (
					<ReactPlayer
						key={streamKey}
						url={streamUrl!}
						playing
						style={{
							position: 'relative',
							top: '0',
							left: '0',
							width: '100%',
							height: '100%',
							objectFit: 'contain',
						}}
						muted
						width={'100%'}
						height={'100%'}
					/>
				)}
				{/* <video
					ref={videoRef}
					autoPlay
					playsInline
					muted
					className="h-full w-full object-cover"
				/> */}
			</div>
		</div>
	);
};

export default UserVideoPanel;
