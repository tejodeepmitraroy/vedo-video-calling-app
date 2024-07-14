'use client';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import UserVideoPanel from '../components/ui/UserVideoPanel';
import { useAuth, useUser } from '@clerk/nextjs';
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
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
import WaitingRoomControls from '../components/ui/WaitingRoomControls';

const WaitingLobby = ({ roomId }: { roomId: string }) => {
	const setLocalStream = useStreamStore((state) => state.setLocalStream);
	const setRemoteSocketId = useStreamStore((state) => state.setRemoteSocketId);
	const selectedCamera = useStreamStore((state) => state.selectedCamera);
	const selectedMicrophone = useStreamStore(
		(state) => state.selectedMicrophone
	);
	const setMediaDevices = useStreamStore((state) => state.setMediaDevices);
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
				const { data } = await axios(
					`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/room/${roomId}`,
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
					}
				);
				const response = data.data;
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
	const handleHostEnterRoom = useCallback(async () => {
		socketEmit('event:joinRoom', {
			roomId: roomId,
			userId,
			username: user?.fullName,
			hostUser: true,
		});
	}, [roomId, socketEmit, user?.fullName, userId]);

	//Client join Room
	const handleAskedToEnter = useCallback(async () => {
		socketEmit('event:askToEnter', {
			roomId,
			username: user?.fullName,
			profilePic: user?.imageUrl,
			offer: peerOffer,
		});

		setAskToEnter(true);
	}, [peerOffer, roomId, socketEmit, user?.fullName, user?.imageUrl]);

	////////////////////////////////////////////////////////////////////////////////////////////////////

	const getMediaDevices = useCallback(async () => {
		const mediaDevice = await webRTCService.getAllMediaDevices();
		setMediaDevices(mediaDevice!);
	}, [setMediaDevices]);

	const getUserMedia = useCallback(async () => {
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
		const offer = await webRTCService.getOffer();
		setPeerOffer(offer);
		console.log('Current--->', offer);
	}, [setPeerOffer]);

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


	useEffect(() => {
		socketOn('event:joinRoom', handleJoinRoom);
		socketOn('event:enterRoom', handleEnterRoom);
		socketOn('notification:hostIsNoExistInRoom', handleHostIsNoExistInRoom);
		socketOn(
			'notification:roomEnterPermissionDenied',
			roomEnterPermissionDenied
		);

		return () => {
			socketOff('event:joinRoom', handleJoinRoom);
			socketOff('event:enterRoom', handleEnterRoom);
			socketOff('notification:hostIsNoExistInRoom', handleHostIsNoExistInRoom);
			socketOff(
				'notification:roomEnterPermissionDenied',
				roomEnterPermissionDenied
			);
			socketOff('notification:roomLimitFull', handleRoomLimitFull);
		};
	}, [handleEnterRoom, handleHostIsNoExistInRoom, handleJoinRoom, handleRoomLimitFull, roomEnterPermissionDenied, socketOff, socketOn]);



	///// All socket Events are Executed Here

	// useEffect(() => {
	// 	socketOn('event:joinRoom', handleJoinRoom);
	// 	socketOn('event:enterRoom', handleEnterRoom);

	// 	return () => {
	// 		socketOff('event:joinRoom', handleJoinRoom);
	// 		socketOff('event:enterRoom', handleEnterRoom);
	// 	};
	// }, [handleEnterRoom, handleJoinRoom, socketOff, socketOn]);

	//// All socket Notification are Executed Here

	// useEffect(() => {
	// 	socketOn('notification:hostIsNoExistInRoom', handleHostIsNoExistInRoom);
	// 	socketOn(
	// 		'notification:roomEnterPermissionDenied',
	// 		roomEnterPermissionDenied
	// 	);
	// 	socketOn('notification:roomLimitFull', handleRoomLimitFull);
	// 	return () => {
	// 		socketOff('notification:hostIsNoExistInRoom', handleHostIsNoExistInRoom);
	// 		socketOff(
	// 			'notification:roomEnterPermissionDenied',
	// 			roomEnterPermissionDenied
	// 		);
	// 		socketOff('notification:roomLimitFull', handleRoomLimitFull);
	// 	};
	// }, [
	// 	handleHostIsNoExistInRoom,
	// 	handleRoomLimitFull,
	// 	roomEnterPermissionDenied,
	// 	socketOff,
	// 	socketOn,
	// ]);

	
	////////////////////////////////////////////////////////////////////////////////////////////////////
	return (
		<div className="grid h-screen w-full md:pl-[60px]">
			<Sidebar />
			<div className="flex flex-col">
				<NavBar heading="Waiting Lobby" />
				<main className="mb-14 flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:flex-row lg:gap-6 lg:p-6">
					<div className="relative flex h-full w-full flex-col items-center justify-center p-5 px-10 md:w-[50%]">
						<div className="relative aspect-video w-full">
							<UserVideoPanel muted={true} />
							<WaitingRoomControls />
						</div>
					</div>
					<div className="flex h-full w-full flex-col items-center justify-center p-5 md:w-[50%]">
						<Card className="w-full border border-dashed">
							{roomDetails ? (
								<>
									<CardHeader>
										<div className="flex items-center justify-between">
											Title{' '}
											<RWebShare
												data={{
													text: 'Share',
													url: window.location.href,
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

									<CardFooter className="item-center flex justify-evenly">
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
								<div className="flex w-full items-center justify-center">
									<Spinner />
								</div>
							)}
						</Card>
					</div>
				</main>
			</div>
			<BottomNavigation />
		</div>
	);
};

export default WaitingLobby;
