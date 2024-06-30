'use client';
import Navbar from '@/components/Navbar';
import ScheduleCallForm from '@/components/ScheduleCallForm';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone } from 'lucide-react';
import React, { FC, useCallback, useEffect, useState } from 'react';
import UserVideoPanel from '../components/ui/UserVideoPanel';
import ControlPanel from '../components/ui/ControlPanel';
import { useAuth } from '@clerk/nextjs';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useRoomStore } from '@/store/useStreamStore';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSocket } from '@/context/SocketContext';

interface WaitingLobbyProps {
	MeetingDetails:
		| {
				createdAt: Date;
				createdById: string;
				description: string | null;
				endTime: Date | null;
				id: string;
				meetingId: string;
				participantIds: string[];
				startTime: Date | null;
				title: string;
				updatedAt: Date;
				videoCallUrl: string;
		  }
		| undefined;
	roomId: string;
}

export interface Device {
	deviceId: string;
	label: string;
	groupId: string;
}

interface MediaDevices {
	cameras: Device[];
	microphones: Device[];
}

const WaitingLobby: FC<WaitingLobbyProps> = ({ MeetingDetails, roomId }) => {
	const stream = useRoomStore((state) => state.stream);
	const setStream = useRoomStore((state) => state.setStream);
	const isCameraOn = useRoomStore((state) => state.isCameraOn);
	const isMicrophoneOn = useRoomStore((state) => state.isMicrophoneOn);
	const selectedCamera = useRoomStore((state) => state.selectedCamera);
	const selectedMicrophone = useRoomStore((state) => state.selectedMicrophone);
	const setSelectedCamera = useRoomStore((state) => state.setSelectedCamera);
	const setSelectedMicrophone = useRoomStore(
		(state) => state.setSelectedMicrophone
	);

	const [devices, setDevices] = useState<MediaDevices>({
		cameras: [],
		microphones: [],
	});
	const { getToken, userId } = useAuth();
	const { socket, socketOn, socketEmit, socketOff } = useSocket();

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

	const getUserMedia = useCallback(
		async (cameraId: string, microphoneId: string) => {
			try {
				const constraints = {
					video: cameraId
						? {
								deviceId: { exact: cameraId },
								width: { ideal: 1280 },
								height: { ideal: 720 },
							}
						: true,

					audio: microphoneId ? { deviceId: { exact: microphoneId } } : true,
				};

				console.log(' constraints', constraints);

				const stream = await navigator.mediaDevices.getUserMedia(constraints);
				console.log(' Stream -->', stream);
				setStream(stream);
			} catch (error) {
				console.error('Error accessing media devices:', error);
			}
		},
		[setStream]
	);

	const handleEnterRoom = async () => {
		console.log('Enter Room number', roomId);

		console.log('User Id', userId);

		socketEmit('event:joinRoom', { roomId, userId });
	};

	const handleAskedToEnter = async () => {
		console.log('Enter Room number', roomId);

		console.log('User Id', userId);

		socketEmit('event:askToEnter', { roomId, userId });
	};

	useEffect(() => {
		if (selectedCamera || selectedMicrophone) {
			console.log('Camera-->', selectedCamera);
			console.log('Microphone-->', selectedMicrophone);
			getUserMedia(selectedCamera, selectedMicrophone);
		}
	}, [getUserMedia, selectedCamera, selectedMicrophone]);

	console.log('Device---->', devices);
	useEffect(() => {
		getMediaDevices();
	}, [getMediaDevices]);

	return (
		<div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
			<Navbar />
			<div className="flex flex-col">
				<Sidebar />
				<main className="flex flex-1 flex-row gap-4 p-4 lg:gap-6 lg:p-6">
					<div className="flex h-full w-[30%] flex-col items-center">
						{/* <h1 className="text-lg font-semibold md:text-2xl">Control page</h1> */}

						<Card className="w-full border border-dashed">
							<CardHeader>
								<div>Title</div>
								<CardTitle>{MeetingDetails?.title}</CardTitle>
								<div>Description</div>
								<CardDescription>{MeetingDetails?.description}</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col gap-3">
								<div className="flex w-full items-center justify-between">
									<span>Select your Camera</span>
									<Select
										onValueChange={(value) => {
											setSelectedCamera(value);
										}}
										defaultValue={selectedCamera}
									>
										<SelectTrigger className="w-1/2">
											<SelectValue placeholder="Select a Camera" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectLabel>Camera</SelectLabel>
												{devices.cameras.length === 1 ? (
													<SelectItem value={'NoMicrophone'}>
														No Microphone
													</SelectItem>
												) : (
													devices.cameras.map((camera) => (
														<SelectItem
															value={camera.deviceId}
															key={camera.deviceId}
														>
															{camera.label || `Camera ${camera.deviceId}`}
														</SelectItem>
													))
												)}
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>
								<div className="flex w-full items-center justify-between">
									<span>Select your Mic</span>
									<Select
										onValueChange={(value) => {
											setSelectedMicrophone(value);
										}}
										defaultValue={selectedMicrophone}
									>
										<SelectTrigger className="w-1/2">
											<SelectValue placeholder="Select a Microphone" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectLabel>Microphone</SelectLabel>
												{devices.microphones.length === 1 ? (
													<SelectItem value={'NoMicrophone'}>
														No Microphone
													</SelectItem>
												) : (
													devices.microphones.map((microphone) => (
														<SelectItem
															key={microphone.deviceId}
															value={microphone.deviceId}
														>
															{microphone.label ||
																`Microphone ${microphone.deviceId}`}
														</SelectItem>
													))
												)}
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>
							</CardContent>
							<CardFooter className="item-center flex flex-col">
								{MeetingDetails?.createdById === userId ? (
									<Button onClick={() => handleEnterRoom()}>
										Join Room
									</Button>
								) : (
									<Button onClick={() => handleAskedToEnter()}>
										ask to Join
									</Button>
								)}
							</CardFooter>
						</Card>
					</div>
					<div className="flex h-full w-[70%] flex-col items-center border border-dashed p-5">
						<h1 className="text-lg font-semibold md:text-2xl">Preview Page</h1>

						<div>Video source</div>
						<div className="aspect-video w-full">
							<UserVideoPanel stream={stream} muted={false} />
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default WaitingLobby;
