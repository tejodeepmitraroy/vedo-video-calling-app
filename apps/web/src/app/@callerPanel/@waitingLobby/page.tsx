'use client';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
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
import { RWebShare } from 'react-web-share';
import Spinner from '@/components/ui/spinner';
import useStreamStore from '@/store/useStreamStore';
import useRoomStore from '@/store/useRoomStore';
import dynamic from 'next/dynamic';
import UserVideoPanel from '@/app/@callerPanel/@waitingLobby/components/UserVideoPanel';
import { useWebRTC } from '@/context/WebRTCContext';
import useGlobalStore from '@/store/useGlobalStore';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const MediaControls = dynamic(() => import('./components/MediaControls'));

const WaitingLobby = ({ roomId }: { roomId: string }) => {
	const setRemoteSocketId = useStreamStore((state) => state.setRemoteSocketId);
	const { user } = useUser();
	const { socketOn, socketEmit, socketOff } = useSocket();
	const [askToEnter, setAskToEnter] = useState(false);
	const { getToken, userId } = useAuth();
	const roomDetails = useGlobalStore((state) => state.roomDetails);
	const setRoomDetails = useGlobalStore((state) => state.setRoomDetails);
	const setRoomState = useRoomStore((state) => state.setRoomState);
	const router = useRouter();
	const { createOffer, setRemoteDescription, getAnswer } = useWebRTC();
	const [canJoin, setCanJoin] = useState<boolean>();

	console.log('Waiting Component mounted++++++++++');

	////////////////////////////////////////////////////////////////////////////////////////////
	const getRoomDetails = useCallback(async () => {
		const token = await getToken();
		try {
			const { data } = await axios(
				`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/room?roomId=${roomId}`,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const response = data.data;

			console.log('Room Details ------------->>>', response);

			/////////////////////////////////////////////////////////////////////////////
			const checkJoinedRoom = response.createdById === userId;

			console.log('checkPreviouslyJoinedRoom====>', checkJoinedRoom);
			socketEmit('event:checkPreviouslyJoinedRoom', {
				roomId,
				hostUser: checkJoinedRoom,
			});

			/////////////////////////////////////////////////////////////////////////////
			if (response) {
				setRoomDetails(response);
			} else {
				toast.error('Room Id Not Existed');
				router.push('/');
			}
		} catch (error) {
			console.log(error);
		}
	}, [getToken, roomId, router, setRoomDetails, socketEmit, userId]);

	useEffect(() => {
		getRoomDetails();
	}, [getRoomDetails]);

	///////////////////////////////////////////////////////////////////////////////////////////

	// const createOffer = useCallback(async () => {
	// 	const offer = await webRTC.createOffer();
	// 	console.log('Created Offer =======================>', offer);
	// 	setPeerOffer(offer);
	// }, [setPeerOffer]);

	// useEffect(() => {
	// 	createOffer();
	// }, [createOffer]);

	/////////////////////////////////////////////////////////////////////////////////////////////////////

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

	/////////////////////////////////////////////////////////////////////////

	//User join Room
	const handleJoinRoom = useCallback(async () => {
		const checkJoinedRoom = roomDetails?.createdById === userId;
		socketEmit('event:joinRoom', {
			roomId: roomId,
			hostUser: checkJoinedRoom,
		});
	}, [roomDetails?.createdById, roomId, socketEmit, userId]);

	//User ask join Room
	const handleAskToJoin = useCallback(async () => {
		const offer = await createOffer();
		// console.log('Client Offer===========>', offer);
		socketEmit('event:askToJoin', {
			roomId,
			offer: offer,
		});

		setAskToEnter(true);
	}, [createOffer, roomId, socketEmit]);

	////////////////////////////////////////////////////////////////////////////////////////////////////

	//// All socket Event Function are Define Here
	const joinRoom = useCallback(
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
			console.log('Host answer Added', hostAnswer);

			// await webRTC.setRemoteDescription(hostAnswer);
			setRemoteDescription(hostAnswer);
			// const answer = await webRTC.getAnswer(hostOffer);
			const answer = await getAnswer(hostOffer);

			console.log('Client answer', answer);

			socketEmit('event:sendAnswerHost', {
				hostUserSocketId,
				answer,
			});
		},
		[
			getAnswer,
			roomDetails?.meetingId,
			roomId,
			setRemoteDescription,
			setRemoteSocketId,
			socketEmit,
			user?.fullName,
			userId,
		]
	);

	const handleEnterRoom = useCallback(() => {
		setRoomState('meetingRoom');
	}, [setRoomState]);

	/////// All socket Notification Function are Define Here
	const roomEnterPermissionDenied = useCallback(() => {
		setAskToEnter(false);
		toast.error("Sorry host don't want to Enter you");
	}, [setAskToEnter]);

	const handleHostIsNoExistInRoom = useCallback(() => {
		setAskToEnter(false);
		toast.warn(`Host is Not Existed in Room. Please wait`);
	}, [setAskToEnter]);

	const handleRoomLimitFull = useCallback(() => {
		setAskToEnter(false);
		toast.warn(`Room Limit Full`);
	}, [setAskToEnter]);

	////////////////////////////////////////////////////////////////////////////////////////////////////
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

	//// All socket Notification are Executed Here
	useEffect(() => {
		console.log('Setup All Socket Events ------------->>>');
		socketOn('event:joinRoom', joinRoom);
		socketOn('event:enterRoom', handleEnterRoom);
		return () => {
			console.log('Off All Socket Events ------------->>>');
			socketOff('event:joinRoom', joinRoom);
			socketOff('event:enterRoom', handleEnterRoom);
		};
	}, [joinRoom, handleEnterRoom, socketOff, socketOn]);

	////////////////////////////////////////////////////////////////////////////////////////////////////
	return (
		<div className="flex flex-1 flex-col rounded-lg bg-background p-4 shadow-sm md:flex-row">
			<div className="relative flex h-full w-full flex-col items-center justify-center p-5 px-10 md:w-[50%]">
				<div className="relative aspect-video w-full">
					<UserVideoPanel />
					<MediaControls />
				</div>
			</div>
			<div className="flex h-full w-full items-center justify-center p-5 md:w-[50%] md:justify-start">
				<Card className="w-full max-w-[400px] border border-dashed">
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
										disabled={askToEnter}
										onClick={() => handleAskToJoin()}
									>
										{askToEnter ? <Spinner /> : <>ask to Join</>}
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
