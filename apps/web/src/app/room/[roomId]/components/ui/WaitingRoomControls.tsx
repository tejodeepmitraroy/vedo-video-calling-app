'use client';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useStreamStore from '@/store/useStreamStore';
import { Mic, Video, ChevronDown, MicOff, VideoOff } from 'lucide-react';
import React from 'react';

export interface Device {
	deviceId: string;
	label: string;
	groupId: string;
}

const WaitingRoomControls = () => {
	const toggleCamera = useStreamStore((state) => state.toggleCamera);
	const toggleMicrophone = useStreamStore((state) => state.toggleMicrophone);
	const isCameraOn = useStreamStore((state) => state.isCameraOn);
	const isMicrophoneOn = useStreamStore((state) => state.isMicrophoneOn);
	const mediaDevices = useStreamStore((state) => state.mediaDevices);
	const setSelectedCamera = useStreamStore((state) => state.setSelectedCamera);
	const setSelectedMicrophone = useStreamStore(
		(state) => state.setSelectedMicrophone
	);

	// console.log('selected Camera------>', selectedCamera);
	// console.log('selected Microphone------>', selectedMicrophone);

	// console.log(
	// 	'camera--->',
	// 	isCameraOn,
	// 	'Mic--->',
	// 	isMicrophoneOn,
	// 	'Stream-------->',
	// 	isScreenSharing
	// );

	return (
		<div className="absolute bottom-0 left-0 right-0 z-20 h-20 flex w-full items-center justify-center bg-transparent">
			<div className="flex gap-4">
				{/* Camera */}
				<div className="flex">
					<Button
						variant={isCameraOn ? 'default' : 'destructive'}
						onClick={() => toggleCamera()}
						className="rounded-r-none p-3"
					>
						{isCameraOn ? (
							<Video className="h-7 w-7" />
						) : (
							<VideoOff className="h-7 w-7" />
						)}
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger
							className={`${isCameraOn ? 'bg-primary' : 'bg-destructive'} rounded-r-md p-2`}
						>
							<ChevronDown className="h-4 w-4 text-background" />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>Cameras</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{mediaDevices.cameras.map((camera) => (
								<DropdownMenuItem
									key={camera.deviceId}
									onClick={() => setSelectedCamera(camera.deviceId)}
								>
									{camera.label || `Camera ${camera.deviceId}`}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Microphone */}
				<div className="flex">
					<Button
						variant={isMicrophoneOn ? 'default' : 'destructive'}
						onClick={() => toggleMicrophone()}
						className="rounded-r-none p-3"
					>
						{isMicrophoneOn ? (
							<Mic className="h-6 w-7" />
						) : (
							<MicOff className="h-7 w-7" />
						)}
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger
							className={`${isMicrophoneOn ? 'bg-primary' : 'bg-destructive'} rounded-r-md p-2`}
						>
							<ChevronDown className="h-4 w-4 text-background" />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>Microphone</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{mediaDevices.microphones.map((microphone) => (
								<DropdownMenuItem
									key={microphone.deviceId}
									onClick={() => setSelectedMicrophone(microphone.deviceId)}
								>
									{microphone.label || `Microphone ${microphone.deviceId}`}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
};

export default WaitingRoomControls;
