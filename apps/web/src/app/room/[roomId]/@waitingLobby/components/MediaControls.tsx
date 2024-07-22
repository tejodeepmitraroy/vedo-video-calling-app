'use client';
import { Button } from '@/components/ui/button';
import useStreamStore from '@/store/useStreamStore';
import { Mic, Video, MicOff, VideoOff } from 'lucide-react';
import React from 'react';

export interface Device {
	deviceId: string;
	label: string;
	groupId: string;
}

const MediaControls = () => {
	const isCameraOn = useStreamStore((state) => state.isCameraOn);
	const isMicrophoneOn = useStreamStore((state) => state.isMicrophoneOn);
	const toggleMicrophone = useStreamStore((state) => state.toggleMicrophone);
	const toggleCamera = useStreamStore((state) => state.toggleCamera);

	console.log(
		'camera--->',
		isCameraOn,
		'Mic--->',
		isMicrophoneOn
		// 'Stream-------->',
		// isScreenSharing
	);

	return (
		<div className="absolute bottom-0 left-0 right-0 z-20 flex h-20 w-full items-center justify-center bg-transparent">
			<div className="flex gap-4">
				{/* Camera */}
				<Button
					variant={isCameraOn ? 'default' : 'destructive'}
					onClick={() => toggleCamera()}
					className="p-5"
				>
					{isCameraOn ? (
						<Video className="h-7 w-7" />
					) : (
						<VideoOff className="h-7 w-7" />
					)}
				</Button>

				{/* Microphone */}
				<Button
					variant={isMicrophoneOn ? 'default' : 'destructive'}
					onClick={() => toggleMicrophone()}
					className="p-5"
				>
					{isMicrophoneOn ? (
						<Mic className="h-6 w-7" />
					) : (
						<MicOff className="h-7 w-7" />
					)}
				</Button>
			</div>
		</div>
	);
};

export default MediaControls;
