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
import { useRoomStore } from '@/store/useStore';
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
import React, { FC, useCallback, useEffect, useState } from 'react';

export interface Device {
	deviceId: string;
	label: string;
	groupId: string;
}

interface MediaDevices {
	cameras: Device[];
	microphones: Device[];
}

const ControlPanel = () => {
	const setStream = useRoomStore((state) => state.setStream);
	const selectedDevices = useRoomStore((state) => state.selectedDevices);
	const setSelectedDevices = useRoomStore((state) => state.setSelectedDevices);
	const toggleCamera = useRoomStore((state) => state.toggleCamera);
	const toggleMicrophone = useRoomStore((state) => state.toggleMicrophone);
	const isCameraOn = useRoomStore((state) => state.isCameraOn);
	const isMicrophoneOn = useRoomStore((state) => state.isMicrophoneOn);
	const toggleScreenShare = useRoomStore((state) => state.toggleScreenShare);
	const isScreenSharing = useRoomStore((state) => state.isScreenSharing);

	const [devices, setDevices] = useState<MediaDevices>({
		cameras: [],
		microphones: [],
	});

	// console.log(
	// 	'camera--->',
	// 	isCameraOn,
	// 	'Mic--->',
	// 	isMicrophoneOn,
	// 	'Stream-------->',
	// 	isScreenSharing
	// );

	const getUserMedia = useCallback(
		// async (isCamera:boolean, isMicrophone:boolean) => {
		// const constraints = {
		// 	video: isCamera
		// 		? selectedDevices.camera
		// 			? { deviceId: { exact: selectedDevices.camera } }
		// 			: true
		// 		: false,
		// 	audio: isMicrophone
		// 		? selectedDevices.microphone
		// 			? { deviceId: { exact: selectedDevices.microphone } }
		// 			: true
		// 		: false,
		// };
		async () => {
			const constraints = {
				video: selectedDevices.camera
					? {
							deviceId: { exact: selectedDevices.camera },

							width: { ideal: 1280 },
							height: { ideal: 720 },
							
						}
					: true,

				audio: selectedDevices.microphone
					? { deviceId: { exact: selectedDevices.microphone } }
					: true,
			};
			// const constraints = {
			// 	video: true,
			// 	audio: true,
			// };

			// console.log('constraints', constraints);

			try {
				const stream = await navigator.mediaDevices.getUserMedia(constraints);
				setStream(stream);
			} catch (error) {
				console.error('Error accessing media devices:', error);
			}
		},

		[selectedDevices.camera, selectedDevices.microphone, setStream]
	);

	const getMediaDevices = useCallback(async () => {
		try {
			const devices = await navigator.mediaDevices.enumerateDevices();
			const cameras = devices.filter((device) => device.kind === 'videoinput');
			const microphones = devices.filter(
				(device) => device.kind === 'audioinput'
			);

			setDevices({ cameras, microphones });
		} catch (error) {
			console.error('Error opening video camera.', error);
		}
	}, []);

	const handleCameraChange = (deviceId: string) => {
		const camera = deviceId;
		setSelectedDevices({ camera, microphone: selectedDevices.microphone });
	};

	const handleMicrophoneChange = (deviceId: string) => {
		const microphone = deviceId;
		setSelectedDevices({
			camera: selectedDevices.camera,
			microphone,
		});
	};

	useEffect(() => {
		getMediaDevices();
	}, [getMediaDevices]);

	useEffect(() => {
		getUserMedia();
		// if (selectedDevices.camera || selectedDevices.microphone) {
		// }
		// console.log('Devices-->', selectedDevices);
		// console.log(
		// 	'isCameraOn-->',
		// 	isCameraOn,
		// 	'isMicrophoneOn-->',
		// 	isMicrophoneOn
		// );
	}, [getUserMedia, isCameraOn, isMicrophoneOn, selectedDevices]);

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
							{devices.cameras.map((camera) => (
								<DropdownMenuItem
									key={camera.deviceId}
									onClick={() => handleCameraChange(camera.deviceId)}
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
							{devices.microphones.map((microphone) => (
								<DropdownMenuItem
									key={microphone.deviceId}
									onClick={() => handleMicrophoneChange(microphone.deviceId)}
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

				<Button variant={'destructive'} className="">
					<Phone className="h-6 w-7" />
				</Button>
			</div>
		</div>
	);
};

export default ControlPanel;
