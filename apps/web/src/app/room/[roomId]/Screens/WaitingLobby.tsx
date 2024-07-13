'use client';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
import React, { FC, useCallback, useEffect, useState } from 'react';
import UserVideoPanel from '../components/ui/UserVideoPanel';
import { useAuth, useUser } from '@clerk/nextjs';
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

import { toast } from 'react-toastify';
import { useSocket } from '@/context/SocketContext';
import Sidebar from '@/components/Sidebar';
import NavBar from '@/components/Navbar';
import BottomNavigation from '@/components/BottomNavigation';
import { RWebShare } from 'react-web-share';
import Spinner from '@/components/ui/spinner';
import webRTCService from '@/services/webRTCService';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import useStreamStore from '@/store/useStreamStore';
import useRoomStore from '@/store/useRoomStore';
import WebRTCService from '@/services/webRTCService';

interface WaitingLobbyProps {
	roomId: string;
}

// export interface Device {
// 	deviceId: string;
// 	label: string;
// 	groupId: string;
// }

const WaitingLobby: FC<WaitingLobbyProps> = ({ roomId }) => {
	const setLocalStream = useStreamStore((state) => state.setLocalStream);
	const setRemoteSocketId = useStreamStore((state) => state.setRemoteSocketId);
	const selectedCamera = useStreamStore((state) => state.selectedCamera);
	const selectedMicrophone = useStreamStore(
		(state) => state.selectedMicrophone
	);
	const setSelectedCamera = useStreamStore((state) => state.setSelectedCamera);
	const setSelectedMicrophone = useStreamStore(
		(state) => state.setSelectedMicrophone
	);
	const setMediaDevices = useStreamStore((state) => state.setMediaDevices);
	const mediaDevices = useStreamStore((state) => state.mediaDevices);
	const [roomUrl, setRoomUrl] = useState('');

	const { user } = useUser();
	const { socketOn, socketEmit, socketOff } = useSocket();
	const [askToEnter, setAskToEnter] = useState(false);
	const peerOffer = useStreamStore((state) => state.peerOffer);
	const { getToken, userId } = useAuth();
	const router = useRouter();
	const roomDetails = useRoomStore((state) => state.roomDetails);
	const setPeerOffer = useStreamStore((state) => state.setPeerOffer);
	const setRoomDetails = useRoomStore((state) => state.setRoomDetails);

	const setRoomState = useRoomStore((state) => state.setRoomState);

	///////////////////////////////////////////////////////////////////////////////////////////

	console.log('Waiting Component mounted++++++++++');
	const getRoomDetails = useCallback(async () => {
		const token = await getToken();

		console.log('Token---->', token);

		if (roomId) {
			try {
				// setIsFetchingRoomDetails(true);

				const { data } = await axios(
					`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/call/${roomId}`,
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
					}
				);
				// setIsFetchingRoomDetails(false);
				const response = data.data;
				// console.log('Room Details---->', response);

				if (response) {
					setRoomDetails(response);
				} else {
					toast.error('Room Id Not Existed');
					router.push('/');
				}
			} catch (error) {
				console.log(error);
			}
		}
	}, [getToken, roomId, router, setRoomDetails]);

	useEffect(() => {
		getRoomDetails();
	}, [getRoomDetails]);

	////////////////////////////////////////////////////////////////////////////////////////////////////
	//Host join Room
	const handleHostEnterRoom = async () => {
		socketEmit('event:joinRoom', {
			roomId: roomId,
			userId,
			username: user?.fullName,
			hostUser: true,
		});
	};

	//Client join Room
	const handleAskedToEnter = async () => {
		console.log('Room number--->', roomId);

		console.log('User Id--->', userId);

		socketEmit('event:askToEnter', {
			roomId,
			username: user?.fullName,
			profilePic: user?.imageUrl,
			offer: peerOffer,
		});

		setAskToEnter(true);
	};

	////////////////////////////////////////////////////////////////////////////////////////////////////

	const getMediaDevices = useCallback(async () => {
		const mediaDevice = await webRTCService.getAllMediaDevices();

		setMediaDevices(mediaDevice!);
	}, [setMediaDevices]);

	const getUserMedia = useCallback(async () => {
		// const mediaStream = await webRTCService.getUserMedia({
		// 	selectedCamera,
		// 	selectedMicrophone,
		// });
		const mediaStream = await webRTCService.getUserMedia();
		console.log('Media Stream in Waiting room ------------->>>', mediaStream);
		setLocalStream(mediaStream!);
	}, [setLocalStream]);

	useEffect(() => {
		if (selectedCamera || selectedMicrophone) {
			console.log('Camera-->', selectedCamera);
			console.log('Microphone-->', selectedMicrophone);
			getUserMedia();
		}

		getMediaDevices();
	}, [getMediaDevices, getUserMedia, selectedCamera, selectedMicrophone]);

	const creationOffer = useCallback(async () => {
		const offer = await WebRTCService.getOffer();
		setPeerOffer(offer);
		console.log('Current--->', offer);
	}, [setPeerOffer]);

	// useEffect(() => {
	// 	creationOffer();
	// }, [creationOffer]);

	// useEffect(() => {
	// 	creationOffer();
	// }, [creationOffer]);

	////////////////////////////////////////////////////////////////////////////////////////////////////

	useEffect(() => {
		setRoomUrl(window.location.href);
	}, []);

	////////////////////////////////////////////////////////////////////////////////////////////////////

	//// All socket Event Function are Define Here
	const handleJoinRoom = useCallback(
		async ({
			answer: hostAnswer,
			hostOffer,
			hostUserSocketId,
		}: {
			answer: RTCSessionDescriptionInit;
			hostOffer: RTCSessionDescriptionInit;
			hostUserSocketId: string;
		}) => {
			console.log('Second Socket User Joined', hostUserSocketId);
			if (hostUserSocketId) {
				setRemoteSocketId(hostUserSocketId);
				console.log('SET  Remote Socket ID--->', hostUserSocketId);
			}

			if (roomDetails?.meetingId !== userId) {
				socketEmit('event:joinRoom', {
					roomId: roomId,
					userId,
					username: user?.fullName,
					hostUser: false,
				});
			}
			console.log('Host Offer ------------>', hostOffer);
			await webRTCService.addAnswer(hostAnswer);
			console.log('Host answer Added', hostAnswer);

			const answer = await webRTCService.createAnswer(hostOffer);

			console.log('Client answer', answer);

			socketEmit('event:sendAnswerHost', {
				hostUserSocketId,
				answer,
			});
		},
		[
			roomDetails?.meetingId,
			roomId,
			setRemoteSocketId,
			socketEmit,
			user?.fullName,
			userId,
		]
	);

	const handleEnterRoom = useCallback(() => {
		setRoomState('meetingRoom');
	}, [setRoomState]);

	//// All socket Notification Function are Define Here
	const roomEnterPermissionDenied = useCallback(() => {
		setAskToEnter(false);
		toast.error("Sorry host don't want to Enter you");
	}, []);

	const handleHostIsNoExistInRoom = useCallback(() => {
		setAskToEnter(false);
		toast.warn(`Host is Not Existed in Room. Please wait`);
	}, []);

	const handleRoomLimitFull = useCallback(() => {
		setAskToEnter(false);
		toast.warn(`Room Limit Full`);
	}, []);

	////////////////////////////////////////////////////////////////////////////////////////////////////
	///// All socket Events are Executed Here

	useEffect(() => {
		socketOn('event:joinRoom', handleJoinRoom);
		socketOn('event:enterRoom', handleEnterRoom);

		return () => {
			socketOff('event:joinRoom', handleJoinRoom);
			socketOff('event:enterRoom', handleEnterRoom);
		};
	}, [handleEnterRoom, handleJoinRoom, socketOff, socketOn]);

	//// All socket Notification are Executed Here

	useEffect(() => {
		socketOn('notification:hostIsNoExistInRoom', handleHostIsNoExistInRoom);
		socketOn(
			'notification:roomEnterPermissionDenied',
			roomEnterPermissionDenied
		);
		socketOn('notification:roomLimitFull', handleRoomLimitFull);
		return () => {
			socketOff('notification:hostIsNoExistInRoom', handleHostIsNoExistInRoom);
			socketOff(
				'notification:roomEnterPermissionDenied',
				roomEnterPermissionDenied
			);
			socketOff('notification:roomLimitFull', handleRoomLimitFull);
		};
	}, [
		handleHostIsNoExistInRoom,
		handleRoomLimitFull,
		roomEnterPermissionDenied,
		socketOff,
		socketOn,
	]);
	////////////////////////////////////////////////////////////////////////////////////////////////////
	return (
		<div className="grid h-screen w-full md:pl-[60px]">
			<Sidebar />
			<div className="flex flex-col">
				<NavBar heading="Waiting Lobby" />
				<main className="mb-14 flex flex-1 flex-col-reverse gap-4 overflow-y-auto p-4 md:flex-row lg:gap-6 lg:p-6">
					<div className="flex h-full w-full flex-col items-center md:w-[40%]">
						{/* <h1 className="text-lg font-semibold md:text-2xl">Control page</h1> */}

						<Card className="w-full border border-dashed">
							{roomDetails ? (
								<>
									<CardHeader>
										<div className="flex items-center justify-between">
											Title{' '}
											<RWebShare
												data={{
													text: 'Share',
													url: roomUrl,
													title: 'roomUrl',
												}}
												onClick={() =>
													console.log('roomUrl shared successfully!')
												}
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
											{roomDetails ? roomDetails.title : <Spinner />}
										</CardTitle>
										<div>Description</div>
										<CardDescription>
											{roomDetails ? roomDetails?.description : <Spinner />}
										</CardDescription>
									</CardHeader>

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
																No Camera Detected
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
										{roomDetails?.createdById === userId ? (
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
										<Button onClick={() => creationOffer()}>
											Create a Offer
										</Button>
									</CardFooter>
								</>
							) : (
								<Spinner />
							)}
						</Card>
					</div>
					<div className="flex h-full w-full flex-col items-center p-5 px-20 md:w-[60%]">
						{/* <h1 className="text-lg font-semibold md:text-2xl">Video source</h1> */}
						{/* <div>Video source</div> */}
						<div className="aspect-video w-full">
							<UserVideoPanel muted={true} />
						</div>
					</div>
				</main>
			</div>
			<BottomNavigation />
		</div>
	);
};

export default WaitingLobby;
