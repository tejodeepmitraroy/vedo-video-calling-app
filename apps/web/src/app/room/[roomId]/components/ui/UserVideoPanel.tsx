'use client';
import { useRoomStore } from '@/store/useStreamStore';
import dynamic from 'next/dynamic';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
// import ReactPlayer from 'react-player';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
interface UserVideoPanelProps {
	// stream: MediaStream | null;
	muted: boolean;
}

const UserVideoPanel: FC<UserVideoPanelProps> = ({ muted }) => {
	const stream = useRoomStore((state) => state.stream);
	const [updateStream, setUpdateStream] = useState<MediaStream | null>(null);
	const setStream = useRoomStore((state) => state.setStream);
	const selectedCamera = useRoomStore((state) => state.selectedCamera);
	const selectedMicrophone = useRoomStore((state) => state.selectedMicrophone);

	// const getUserMedia = useCallback(
	// 	async (cameraId: string, microphoneId: string) => {
	// 		try {
	// 			const constraints = {
	// 				video: cameraId
	// 					? {
	// 							deviceId: { exact: cameraId },
	// 							width: { ideal: 1280 },
	// 							height: { ideal: 720 },
	// 						}
	// 					: {
	// 							width: { ideal: 1280 },
	// 							height: { ideal: 720 },
	// 						},

	// 				audio: microphoneId ? { deviceId: { exact: microphoneId } } : true,
	// 			};

	// 			// console.log(' constraints', constraints);

	// 			const stream = await navigator.mediaDevices.getUserMedia(constraints);
	// 			// console.log(' Stream -->', stream);
	// 			setStream(stream);
	// 		} catch (error) {
	// 			console.error('Error accessing media devices:', error);
	// 		}
	// 	},
	// 	[setStream]
	// );

	// const handleDeviceChange = async (deviceId) => {
	// 	const newStream = await getUserMedia(selectedCamera, selectedMicrophone);
	// 	setStream(newStream);
	// };

	//   useEffect(() => {
	// 		if ( stream) {
	// 			setUpdateStream;
	// 			videoRef.current.srcObject = stream;
	// 		}
	// 	}, [stream]);

	// useEffect(() => {
	// 	if (selectedCamera || selectedMicrophone) {
	// 		// setUpdateStream(stream);
	// 		console.log('Current Camera-->', selectedCamera);
	// 		console.log('Current Microphone-->', selectedMicrophone);
	// 		getUserMedia(selectedCamera, selectedMicrophone);
	// 	}

	// 	// return()=>{
	// 	// 	if (stream && stream.getTracks) {
	// 	// 		stream.getTracks().forEach((track) => track.stop());
	// 	// 	}
	// 	// }
	// }, [getUserMedia, selectedCamera, selectedMicrophone]);

	
	console.log('steam in Video component---->', stream);
	return (
		<div className="relative z-20 flex aspect-[16/9] h-full w-full">
			<div className="z-30 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl bg-black">
				<ReactPlayer
					url={stream!}
					playing
					style={{
						position: 'relative',
						top: '0',
						left: '0',
						width: '100%',
						height: '100%',
						objectFit: 'contain',
					}}
					muted={muted}
					width={'100%'}
					height={'100%'}
				/>

				{/* <div className="absolute bottom-2 right-2 rounded-3xl bg-white px-3 py-1 text-[1.4vw] font-semibold">
				Tejodeep Mitra Roy
				</div> */}
			</div>
		</div>
	);
};

export default UserVideoPanel;
