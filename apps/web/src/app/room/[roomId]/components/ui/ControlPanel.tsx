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
import { useSocket } from '@/context/SocketContext';
import webRTCService from '@/services/webRTCService';
import useRoomStore from '@/store/useRoomStore';
import useStreamStore from '@/store/useStreamStore';

import {
	Mic,
	Phone,
	Video,
	ChevronDown,
	MicOff,
	VideoOff,
	ScreenShare,
	ScreenShareOff,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';

export interface Device {
	deviceId: string;
	label: string;
	groupId: string;
}

const ControlPanel = ({
	roomId,
	userId,
}: {
	roomId: string;
	userId: string;
}) => {
	const toggleCamera = useStreamStore((state) => state.toggleCamera);
	const toggleMicrophone = useStreamStore((state) => state.toggleMicrophone);
	const isCameraOn = useStreamStore((state) => state.isCameraOn);
	const isMicrophoneOn = useStreamStore((state) => state.isMicrophoneOn);
	const toggleScreenShare = useStreamStore((state) => state.toggleScreenShare);
	const isScreenSharing = useStreamStore((state) => state.isScreenSharing);
	const mediaDevices = useStreamStore((state) => state.mediaDevices);
	// const selectedCamera = useRoomStore((state) => state.selectedCamera);
	// const selectedMicrophone = useRoomStore((state) => state.selectedMicrophone);
	const setSelectedCamera = useStreamStore((state) => state.setSelectedCamera);
	const setSelectedMicrophone = useStreamStore(
		(state) => state.setSelectedMicrophone
	);
	const setRoomState = useRoomStore((state) => state.setRoomState);

	const { socketEmit } = useSocket();
	const router = useRouter();

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

	const handleCallEnd = useCallback(() => {
		socketEmit('event:callEnd', {
			roomId,
			userId,
		});
		webRTCService.disconnectPeer();
		// router.refresh();

		setRoomState('outSideLobby');
	}, [roomId, setRoomState, socketEmit, userId]);

	return (
		<div className="flex h-[9vh] w-full items-center justify-center border border-white bg-background">
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

				<Button
					onClick={() => toggleScreenShare()}
					variant={isScreenSharing ? 'destructive' : 'default'}
				>
					{isScreenSharing ? (
						<ScreenShareOff className="h-6 w-7" />
					) : (
						<ScreenShare className="h-6 w-7" />
					)}
				</Button>

				<Button
					variant={'destructive'}
					onClick={() => handleCallEnd()}
					className=""
				>
					<Phone className="h-6 w-7" />
				</Button>
			</div>
		</div>
	);
};

export default ControlPanel;
