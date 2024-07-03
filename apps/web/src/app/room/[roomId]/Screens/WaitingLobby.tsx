'use client';

import ScheduleCallForm from '@/components/ScheduleCallForm';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, Share } from 'lucide-react';
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
import Sidebar from '@/components/Sidebar';
import NavBar from '@/components/Navbar';
import BottomNavigation from '@/components/BottomNavigation';
import { RWebShare } from 'react-web-share';
import Spinner from '@/components/ui/spinner';

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
	isFetchingRoomDetails: boolean;
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

const WaitingLobby: FC<WaitingLobbyProps> = ({
	MeetingDetails,
	roomId,
	isFetchingRoomDetails,
}) => {
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

	const setMediaDevices = useRoomStore((state) => state.setMediaDevices);
	const mediaDevices = useRoomStore((state) => state.mediaDevices);

	// const [devices, setDevices] = useState<MediaDevices>({
	// 	cameras: [],
	// 	microphones: [],
	// });
	const [roomUrl, setRoomUrl] = useState('');
	const { getToken, userId } = useAuth();
	const { socket, socketOn, socketEmit, socketOff } = useSocket();
	const [askToEnter, setAskToEnter] = useState(false);

	const getMediaDevices = useCallback(async () => {
		try {
			const devices = await navigator.mediaDevices.enumerateDevices();
			const cameras = devices.filter((device) => device.kind === 'videoinput');
			const microphones = devices.filter(
				(device) => device.kind === 'audioinput'
			);

			setMediaDevices({ cameras, microphones });
		} catch (error) {
			console.error('Error opening video camera.', error);
		}
	}, [setMediaDevices]);

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
						: {
								width: { ideal: 1280 },
								height: { ideal: 720 },
							},

					audio: microphoneId ? { deviceId: { exact: microphoneId } } : true,
				};

				// console.log(' constraints', constraints);

				const stream = await navigator.mediaDevices.getUserMedia(constraints);
				// console.log(' Stream -->', stream);
				setStream(stream);
			} catch (error) {
				console.error('Error accessing media devices:', error);
			}
		},
		[setStream]
	);

	//Host join Room
	const handleHostEnterRoom = async () => {
		console.log('Room number--->', roomId);

		console.log('User Id--->', userId);

		socketEmit('event:hostEnterRoom', { roomId, userId });
	};

	const handleAskedToEnter = async () => {
		console.log('Room number--->', roomId);

		console.log('User Id--->', userId);

		socketEmit('event:askToEnter', { roomId, userId });
		setAskToEnter(true);
	};

	useEffect(() => {
		// if (selectedCamera || selectedMicrophone) {
		// 	console.log('Camera-->', selectedCamera);
		// 	console.log('Microphone-->', selectedMicrophone);
		// }
		getUserMedia(selectedCamera, selectedMicrophone);
	}, [getUserMedia, selectedCamera, selectedMicrophone]);

	useEffect(() => {
		getMediaDevices();
	}, [getMediaDevices]);

	useEffect(() => {
		setRoomUrl(window.location.href);
	}, []);

	//// All socket Notification Function are Define Here
	const roomEnterPermissionDenied = useCallback(() => {
		setAskToEnter(false);
		toast.error("Sorry host don't want to Enter you");
	}, []);

	const handleHostIsNoExistInRoom = useCallback(() => {
		setAskToEnter(false);
		toast.warn(`Host is Not Existed in Room. Please wait`);
	}, []);

	///// All socket Events are Executed Here
	useEffect(() => {
		return () => {};
	}, [socketOff, socketOn]);

	//// All socket Notification are Executed Here

	useEffect(() => {
		socketOn('notification:hostIsNoExistInRoom', handleHostIsNoExistInRoom);
		socketOn(
			'notification:roomEnterPermissionDenied',
			roomEnterPermissionDenied
		);
		return () => {
			socketOff('notification:hostIsNoExistInRoom', handleHostIsNoExistInRoom);
			socketOff(
				'notification:roomEnterPermissionDenied',
				roomEnterPermissionDenied
			);
		};
	}, [
		handleHostIsNoExistInRoom,
		roomEnterPermissionDenied,
		socketOff,
		socketOn,
	]);

	return (
		<div className="grid h-screen w-full md:pl-[60px]">
			<Sidebar />
			<div className="flex flex-col">
				<NavBar heading="Waiting Lobby" />
				<main className="mb-14 flex flex-1 flex-col-reverse gap-4 overflow-y-auto p-4 md:flex-row lg:gap-6 lg:p-6">
					<div className="flex h-full w-full flex-col items-center md:w-[40%]">
						{/* <h1 className="text-lg font-semibold md:text-2xl">Control page</h1> */}

						<Card className="w-full border border-dashed">
							{isFetchingRoomDetails ? <Spinner /> : <></>}
							<CardHeader>
								<div className="flex items-center justify-between">
									Title{' '}
									<RWebShare
										data={{
											text: 'Share',
											url: roomUrl,
											title: 'roomUrl',
										}}
										onClick={() => console.log('roomUrl shared successfully!')}
									>
										<Button
											variant="outline"
											size="sm"
											className="ml-auto gap-1.5 text-sm"
										>
											<Share className="size-3.5" />
											Share
										</Button>
									</RWebShare>
								</div>
								<CardTitle>
									{isFetchingRoomDetails ? <Spinner /> : MeetingDetails?.title}
								</CardTitle>
								<div>Description</div>
								<CardDescription>
									{isFetchingRoomDetails ? (
										<Spinner />
									) : (
										MeetingDetails?.description
									)}
								</CardDescription>
							</CardHeader>
							{isFetchingRoomDetails ? (
								<Spinner />
							) : (
								<>
									<CardContent className="mt-5 flex flex-col gap-3">
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
														{mediaDevices.cameras.length === 1 ? (
															<SelectItem value={'NoCamera'}>
																No gitCamera Detected
															</SelectItem>
														) : (
															mediaDevices.cameras.map((camera) => (
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
														{mediaDevices.microphones.length === 1 ? (
															<SelectItem value={'NoMicrophone'}>
																No Microphone Detected
															</SelectItem>
														) : (
															mediaDevices.microphones.map((microphone) => (
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
											<Button onClick={() => handleHostEnterRoom()}>
												Join Room
											</Button>
										) : (
											<Button
												disabled={askToEnter}
												onClick={() => handleAskedToEnter()}
											>
												{askToEnter ? <Spinner /> : <>ask to Join</>}
											</Button>
										)}
									</CardFooter>
								</>
							)}
						</Card>
					</div>
					<div className="flex h-full w-full flex-col items-center p-5 px-20 md:w-[60%]">
						{/* <h1 className="text-lg font-semibold md:text-2xl">Video source</h1> */}
						{/* <div>Video source</div> */}
						<div className="aspect-video w-full">
							<UserVideoPanel stream={stream} muted={true} />
						</div>
					</div>
				</main>
			</div>
			<BottomNavigation />
		</div>
	);
};

export default WaitingLobby;
