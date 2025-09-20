'use client';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
// import { useAuth } from '@clerk/nextjs';
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
// import toast from 'react-hot-toast';
import { useSocket } from '@/context/SocketContext';
import { RWebShare } from 'react-web-share';
import Spinner from '@/components/ui/spinner';
import dynamic from 'next/dynamic';
import UserVideoPanel from '@/features/videoCall/components/UserVideoPanel';
import useGlobalStore from '@/store/useGlobalStore';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import useScreenStateStore from '@/store/useScreenStateStore';
import MediaSettings from '@/features/videoCall/components/MediaSettings';
import useDeviceStore from '@/store/useDeviceStore';
import { useWebRTC } from '@/context/WebRTCContext';
import useStreamStore from '@/store/useStreamStore';
import useWaitingLobbySocket from '@/hooks/useWaitingLobbySocket';

const MediaControls = dynamic(() => import('../components/MediaControls'));

const WaitingLobby = ({ roomId }: { roomId: string }) => {
	const { socketOn,  socketOff } = useSocket();
	// const [askToEnter, setAskToEnter] = useState(false);
	// const { userId } = useAuth();
	const roomDetails = useGlobalStore((state) => state.roomDetails);
	// const setRoomDetails = useGlobalStore((state) => state.setRoomDetails);
	// const router = useRouter();
	const [canJoin, setCanJoin] = useState<boolean>();
	// const setCurrentScreen = useScreenStateStore(
	// 	(state) => state.setCurrentScreen
	// );
	const { getUserMedia, getAllMediaDevices } = useWebRTC();
	const selectedCamera = useDeviceStore((state) => state.selectedCamera);
	const selectedMicrophone = useDeviceStore(
		(state) => state.selectedMicrophone
	);
	const localStream = useStreamStore((state) => state.localStream);

	// Initialize media devices and get user media when component mounts
	useEffect(() => {
		const initializeMedia = async () => {
			await getAllMediaDevices();
			if (!localStream) {
				getUserMedia({
					camera: selectedCamera.deviceId,
					microphone: selectedMicrophone.deviceId,
				});
			}
		};

		initializeMedia();

		// Cleanup function to stop tracks when component unmounts
		return () => {
			if (localStream) {
				localStream.getTracks().forEach((track) => track.stop());
			}
		};
	}, [
		getAllMediaDevices,
		getUserMedia,
		localStream,
		selectedCamera.deviceId,
		selectedMicrophone.deviceId,
	]);

	console.log('Waiting Component mounted++++++++++');

	//// Previously joined User
	const handleDirectlyCanJoin = useCallback(
		({ directlyCanJoin }: { directlyCanJoin: boolean }) => {
			setCanJoin(directlyCanJoin);
		},
		[]
	);
	useEffect(() => {
		socketOn('event:directlyCanJoin', handleDirectlyCanJoin);
		return () => {
			socketOff('event:directlyCanJoin', handleDirectlyCanJoin);
		};
	}, [handleDirectlyCanJoin, socketOff, socketOn]);

	const { handleJoinRoom, handleAskToJoin, askToEnterLoading } =
		useWaitingLobbySocket(roomId);

	// ////////////////////////////////////////////////////////////////////////////////////////////
	// const getRoomDetails = useCallback(async () => {
	// 	const token = await getToken();

	// 	try {
	// 		const { data } = await axios(
	// 			`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/room?roomId=${roomId}`,
	// 			{
	// 				headers: {
	// 					'Content-Type': 'application/json',
	// 					Authorization: `Bearer ${token}`,
	// 				},
	// 			}
	// 		);
	// 		const response = data.data;

	// 		/////////////////////////////////////////////////////////////////////////////
	// 		const checkJoinedRoom = response.createdById === userId;

	// 		// console.log('checkPreviouslyJoinedRoom====>', checkJoinedRoom);
	// 		socketEmit('event:checkPreviouslyJoinedRoom', {
	// 			roomId,
	// 			hostUser: checkJoinedRoom,
	// 		});

	// 		/////////////////////////////////////////////////////////////////////////////
	// 		if (response) {
	// 			setRoomDetails(response);
	// 			// toast.success('Room Founded');
	// 		} else {
	// 			// toast.error('Room Id Not Existed');
	// 			router.push('/');
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// }, [getToken, roomId, router, setRoomDetails, socketEmit, userId]);

	// /////////////////////////////////////////////////////////////////////////////////////////////////////

	// //// Previously joined User
	// const handleDirectlyCanJoin = useCallback(
	// 	({ directlyCanJoin }: { directlyCanJoin: boolean }) => {
	// 		setCanJoin(directlyCanJoin);
	// 	},
	// 	[]
	// );

	// useEffect(() => {
	// 	getRoomDetails();
	// 	socketOn('event:directlyCanJoin', handleDirectlyCanJoin);
	// 	return () => {
	// 		socketOff('event:directlyCanJoin', handleDirectlyCanJoin);
	// 	};
	// }, [getRoomDetails, handleDirectlyCanJoin, socketOff, socketOn]);

	/////////////////////////////////////////////////////////////////////////

	//User join Room
	// const handleJoinRoom = useCallback(async () => {
	// 	const checkJoinedRoom = roomDetails?.createdById === userId;
	// 	socketEmit('event:joinRoom', {
	// 		roomId: roomId,
	// 		hostUser: checkJoinedRoom,
	// 	});
	// }, [roomDetails?.createdById, roomId, socketEmit, userId]);

	// //User ask join Room
	// const handleAskToJoin = useCallback(async () => {
	// 	socketEmit('event:askToJoin', {
	// 		roomId,
	// 	});

	// 	setAskToEnter(true);
	// }, [roomId, socketEmit]);

	////////////////////////////////////////////////////////////////////////////////////////////////////

	// /////// All socket Notification Function are Define Here
	// const roomEnterPermissionDenied = useCallback(() => {
	// 	setAskToEnter(false);
	// 	toast.error("Sorry host don't want to enter you");
	// }, [setAskToEnter]);

	// const handleHostIsNotExistedInRoom = useCallback(() => {
	// 	setAskToEnter(false);
	// 	toast.error(`Host is Not Existed in Room. Please wait`);
	// }, [setAskToEnter]);

	// const handleRoomLimitFull = useCallback(() => {
	// 	setAskToEnter(false);
	// 	toast.error(`Room Limit Full`);
	// }, [setAskToEnter]);

	// ////////////////////////////////////////////////////////////////////////////////////////////////////
	// useEffect(() => {
	// 	socketOn(
	// 		'notification:hostIsNotExistedInRoom',
	// 		handleHostIsNotExistedInRoom
	// 	);
	// 	socketOn(
	// 		'notification:roomEnterPermissionDenied',
	// 		roomEnterPermissionDenied
	// 	);
	// 	socketOn('notification:roomLimitFull', handleRoomLimitFull);
	// 	return () => {
	// 		socketOff(
	// 			'notification:hostIsNotExistedInRoom',

	// 			handleHostIsNotExistedInRoom
	// 		);
	// 		socketOff(
	// 			'notification:roomEnterPermissionDenied',
	// 			roomEnterPermissionDenied
	// 		);
	// 		socketOff('notification:roomLimitFull', handleRoomLimitFull);
	// 	};
	// }, [
	// 	handleHostIsNotExistedInRoom,
	// 	handleRoomLimitFull,
	// 	roomEnterPermissionDenied,
	// 	socketOff,
	// 	socketOn,
	// ]);

	//// All socket Event Function are Define Here
	// const joinRoom = useCallback(async () => {
	// 	socketEmit('event:joinRoom', {
	// 		roomId: roomId,
	// 		hostUser: false,
	// 	});
	// }, [roomId, socketEmit]);

	// const handleEnterRoom = useCallback(() => {
	// 	setCurrentScreen('Meeting Room');
	// }, [setCurrentScreen]);

	// //// All socket Notification are Executed Here
	// useEffect(() => {
	// 	// console.log('Setup All Socket Events ------------->>>');
	// 	socketOn('event:joinRoom', joinRoom);
	// 	socketOn('event:enterRoom', handleEnterRoom);
	// 	return () => {
	// 		// console.log('Off All Socket Events ------------->>>');
	// 		socketOff('event:joinRoom', joinRoom);
	// 		socketOff('event:enterRoom', handleEnterRoom);
	// 	};
	// }, [joinRoom, handleEnterRoom, socketOff, socketOn]);

	////////////////////////////////////////////////////////////////////////////////////////////////////
	return (
		<div className="flex h-full w-full flex-col p-4 sm:flex-row">
			<div className="relative flex h-full w-full flex-col items-center justify-center sm:p-5 md:w-[50%] md:px-10">
				<div className="relative aspect-video w-full">
					<UserVideoPanel />
					<MediaControls />
					<MediaSettings />
				</div>
			</div>
			<div className="flex h-full w-full items-center justify-center md:w-[50%] md:justify-start md:p-5">
				<Card className="w-full max-w-[400px] border border-dashed">
					{roomDetails ? (
						<>
							<CardHeader>
								<div className="flex items-center justify-between">
									Title{' '}
									<RWebShare
										data={{
											text: `To join the meeting on VEDO Meet, click this link: ${window.location.href} Or open Meet and enter this code: ${roomId}`,
											url: window.location.href,
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
									{roomDetails ? roomDetails.title : <Spinner />}
								</CardTitle>
								<div>Description</div>
								<CardDescription>
									{roomDetails ? roomDetails?.description : <Spinner />}
								</CardDescription>
							</CardHeader>

							<CardFooter className="item-center flex justify-evenly">
								{canJoin ? (
									<Button onClick={() => handleJoinRoom()}>Join Room</Button>
								) : (
									<Button
										disabled={askToEnterLoading}
										onClick={() => handleAskToJoin()}
									>
										{askToEnterLoading ? <Spinner /> : <>ask to Join</>}
									</Button>
								)}
							</CardFooter>
						</>
					) : (
						<div className="flex w-full items-center justify-center">
							<Spinner />
						</div>
					)}
				</Card>
			</div>
		</div>
	);
};

export default WaitingLobby;
