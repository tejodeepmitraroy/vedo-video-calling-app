'use client';

import React, { FC, useEffect, useMemo, useState } from 'react';
import ReactPlayer from 'react-player';

interface RemoteUserVideoPanelProps {
	stream: MediaStream;
}
const RemoteUserVideoPanel: FC<RemoteUserVideoPanelProps> = ({ stream }) => {
	const [hasWindow, setHasWindow] = useState(false);
	const [streamKey, setStreamKey] = useState(0);
	//   const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setHasWindow(true);
		}
	}, []);

	// Force ReactPlayer to re-render when stream changes
	useEffect(() => {
		if (stream) {
			console.log('UserVideoPanel: Stream changed, updating key');
			setStreamKey((prev) => prev + 1);
		}
	}, [stream]);

	// Create a stable URL from the stream
	const streamUrl = useMemo(() => {
		if (!stream) return null;
		return stream;
	}, [stream]);
	// const isMounted = useRef(true);

	// useEffect(() => {
	// 	const video = videoRef.current;
	// 	if (!video) return;

	// 	const handleStreamChange = (newStream: MediaStream) => {
	// 		if (video.srcObject !== newStream) {
	// 			video.srcObject = newStream;
	// 		}
	// 	};

	// 	// Use requestAnimationFrame to ensure the video element is ready
	// 	const raf = requestAnimationFrame(() => {
	// 		if (isMounted.current) {
	// 			handleStreamChange(stream);
	// 			video.play().catch((e: any) => {
	// 				if (e.name !== 'AbortError') {
	// 					console.warn('Remote video play failed:', e);
	// 				}
	// 			});
	// 		}
	// 	});

	// 	// Handle stream tracks
	// 	const handleTrackEnded = () => {
	// 		console.log('Remote track ended');
	// 		// You can add additional cleanup or UI updates here
	// 	};

	// 	stream.getTracks().forEach((track) => {
	// 		track.addEventListener('ended', handleTrackEnded);
	// 	});

	// 	return () => {
	// 		isMounted.current = false;
	// 		cancelAnimationFrame(raf);

	// 		// Clean up event listeners
	// 		stream.getTracks().forEach((track) => {
	// 			track.removeEventListener('ended', handleTrackEnded);

	// 			// Stop all tracks when component unmounts
	// 			if (track.readyState === 'live') {
	// 				track.stop();
	// 			}
	// 		});

	// 		if (video) {
	// 			video.pause();
	// 			video.srcObject = null;
	// 		}
	// 	};
	// }, [stream]);

	return (
		<div className="relative z-20 flex h-full w-full">
			<div className="z-30 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl bg-[#3c4043]">
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
				/>{' '}
				* */}
			</div>
		</div>
	);
};

export default RemoteUserVideoPanel;
