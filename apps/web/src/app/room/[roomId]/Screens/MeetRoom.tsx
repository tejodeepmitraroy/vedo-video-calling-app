'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
	Home,
	LineChart,
	Package,
	Package2,
	PanelLeft,
	Settings,
	ShoppingCart,
	Users2,
	Video,
	MessagesSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { TooltipProvider } from '@radix-ui/react-tooltip';

import { ScrollArea } from '@/components/ui/scroll-area';
import { useSocket } from '@/context/SocketContext';
import { useAuth, useUser } from '@clerk/nextjs';
import UserProfile from '@/components/UserProfile';
import peer from '@/services/peer';
import { toast } from 'react-toastify';
import { RWebShare } from 'react-web-share';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ControlPanel from '../components/ui/ControlPanel';
import UserVideoPanel from '../components/ui/UserVideoPanel';
import { useRoomStore } from '@/store/useStreamStore';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

const MeetRoom = ({ roomId }: { roomId: string }) => {
	const stream = useRoomStore((state) => state.stream);
	const screenStream = useRoomStore((state) => state.screenStream);
	const isMicrophoneOn = useRoomStore((state) => state.isMicrophoneOn);
	const [remoteStream, setRemoteStream] = useState<MediaStream>();
	const remoteSocketId = useRoomStore((state) => state.remoteSocketId);
	const setRemoteSocketId = useRoomStore((state) => state.setRemoteSocketId);

	console.log('Remote socket ID------>>>>>', remoteSocketId);

	const router = useRouter();
	const { getToken, userId } = useAuth();

	const { socket, socketOn, socketEmit, socketOff } = useSocket();

	const handleUserJoined = useCallback(
		({ userId, id }: { userId: string; id: string }) => {
			console.log('User Joined', userId);
			console.log('Socket User Joined', id);
			// setRemoteSocketId(id);
		},
		[]
	);

	const handleCallUser = useCallback(async () => {
		const offer = await peer.getOffer();
		console.log('creating a Offer--->', offer);
		socket?.emit('event:callUser', { to: remoteSocketId, offer });
	}, [remoteSocketId, socket]);

	const handleIncomingCall = useCallback(
		async ({
			from,
			offer,
		}: {
			from: string;
			offer: RTCSessionDescriptionInit;
		}) => {
			setRemoteSocketId(from);
			console.log('Incoming Call--->', { from, offer });

			const answer = await peer.getAnswer(offer);
			console.log('Creating Answer--->', answer);

			socket?.emit('call:accepted', { to: from, answer });
		},
		[setRemoteSocketId, socket]
	);

	const handleAcceptedCall = useCallback(
		async ({
			from,
			answer,
		}: {
			from: string;
			answer: RTCSessionDescriptionInit;
		}) => {
			await peer.setLocalDescription(answer);
			console.log('call Accepted and Now Sending Stream-->>');

			// sendStreams();
			// for (const track of stream?.getTracks()) {
			// 	peer.peer?.addTrack(track,stream);
			// }
			// console.log('stream-->', stream?.getTracks());
			stream?.getTracks().forEach((track: MediaStreamTrack) => {
				// console.log('Track---->', track);
				peer.peer?.addTrack(track, stream);
			});
		},
		[stream]
	);

	const handleNegoNeeded = useCallback(async () => {
		const offer = await peer.getOffer();
		socket?.emit('peer:nego:needed', { offer, to: remoteSocketId });
	}, [remoteSocketId, socket]);

	const handleNegoNeedIncoming = useCallback(
		async ({
			from,
			offer,
		}: {
			from: string;
			offer: RTCSessionDescriptionInit;
		}) => {
			const answer = await peer.getAnswer(offer);

			console.log('peer:nego:done----> ', answer);

			socket?.emit('peer:nego:done', { to: from, answer });
		},
		[socket]
	);

	const handleNegoNeedFinal = useCallback(
		async ({
			from,
			answer,
		}: {
			from: string;
			answer: RTCSessionDescriptionInit;
		}) => {
			console.log('Final Answer---->', answer);
			await peer.setLocalDescription(answer);
		},
		[]
	);

	const sendStreams = useCallback(() => {
		console.log('send stream-->', stream);
		stream?.getTracks().forEach((track) => {
			console.log('Send track-->', track);
			peer.peer?.addTrack(track, stream);
		});
	}, [stream]);

	useEffect(() => {
		peer.peer?.addEventListener('negotiationneeded', handleNegoNeeded);

		return () => {
			peer.peer?.removeEventListener('negotiationneeded', handleNegoNeeded);
		};
	}, [handleNegoNeeded]);

	useEffect(() => {
		peer.peer?.addEventListener('track', async (event) => {
			const [remoteStream] = event.streams;

			console.log('Remote Stream---->', remoteStream.getTracks());

			setRemoteStream(remoteStream);
		});
	}, []);

	useEffect(() => {
		socket?.on('event:UserJoined', handleUserJoined);
		socket?.on('incoming:call', handleIncomingCall);
		socket?.on('call:accepted', handleAcceptedCall);
		socket?.on('peer:nego:needed', handleNegoNeedIncoming);
		socket?.on('peer:nego:final', handleNegoNeedFinal);

		return () => {
			// socket?.off('event:UserJoined', handleUserJoined);
			socket?.off('incoming:call', handleIncomingCall);
			socket?.off('call:accepted', handleAcceptedCall);
			socket?.off('peer:nego:needed', handleNegoNeedIncoming);
			socket?.off('peer:nego:final', handleNegoNeedFinal);
		};
	}, [
		handleAcceptedCall,
		handleIncomingCall,
		handleNegoNeedFinal,
		handleNegoNeedIncoming,
		handleUserJoined,
		socket,
	]);

	console.log('Meetroom--------->', stream);

	///// All socket Event Function are Define Here
	const roomEnterPermissionAccepted = useCallback(
		(id: string, requestedUserId: string) => {
			console.log(id, requestedUserId);
			setRemoteSocketId(requestedUserId);
			socketEmit('event:roomEnterPermissionAccepted', {
				roomId,
				userId: id,
				hostUserId: userId,
				id: requestedUserId,
			});
		},
		[roomId, setRemoteSocketId, socketEmit, userId]
	);

	const roomEnterPermissionDenied = useCallback(
		(requestedUserId: string) => {
			socketEmit('event:roomEnterPermissionDenied', { id: requestedUserId });
		},
		[socketEmit]
	);

	const userWantToEnter = useCallback(
		async ({ userId, id }: { userId: string; id: string }) => {
			toast(
				<Card>
					<CardHeader>
						<CardDescription>{userId} Want to Enter</CardDescription>
					</CardHeader>

					<CardContent className="flex items-center justify-evenly">
						<Button
							size={'sm'}
							onClick={() => roomEnterPermissionAccepted(userId, id)}
						>
							Accept
						</Button>
						<Button
							size={'sm'}
							variant={'destructive'}
							onClick={() => roomEnterPermissionDenied(id)}
						>
							Reject
						</Button>
					</CardContent>
				</Card>,

				{
					position: 'top-center',
					autoClose: false,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: 'light',
				}
			);
		},
		[roomEnterPermissionAccepted, roomEnterPermissionDenied]
	);

	///// All socket Event Function are Executed Here

	useEffect(() => {
		socketOn('event:userWantToEnter', userWantToEnter);

		return () => {
			socketOff('event:userWantToEnter', userWantToEnter);
		};
	}, [socketOff, socketOn, userWantToEnter]);

	return (
		<div className="flex h-screen w-full flex-col bg-muted/40">
			<div className="relative flex h-screen w-full flex-col">
				<main className="relative h-full w-full overflow-hidden">
					<div className="flex h-[91vh] w-full items-center justify-center bg-black">
						<div className="absolute top-2 z-30 rounded-xl bg-white p-5 text-black">
							{roomId}
						</div>
						{/* <div className="flex h-full w-full max-w-7xl items-center justify-center rounded-xl sm:aspect-video sm:border-2 sm:border-white"> */}
						<div className="flex h-full w-full max-w-[90rem] items-center justify-center rounded-xl">
							{/* {remoteStream && (
								<UserVideoPanel stream={remoteStream} muted={false} />
							)} */}

							{remoteStream ? (
								<UserVideoPanel stream={remoteStream} muted={false} />
							) : (
								<UserVideoPanel stream={stream} muted={!isMicrophoneOn} />
							)}
							{/* <ScreenSharePanel /> */}
						</div>
						{/* <div className="flex h-full w-full flex-col gap-3 overflow-y-auto md:flex-row">
							<div className="relative flex h-full w-full items-center justify-center rounded-xl border-2 border-white bg-black sm:h-1/2 md:aspect-video md:h-auto md:w-1/2">
								<UserVideoPanel stream={stream} muted={!isMicrophoneOn} />
							</div>
							<div className="relative flex h-full w-full items-center justify-center rounded-xl border-2 border-white bg-black sm:h-1/2 md:aspect-video md:h-auto md:w-1/2">
								<UserVideoPanel stream={stream} muted={!isMicrophoneOn} />
							</div>
						</div> */}
						{/* {screenStream ? (
							<div className="flex h-full w-full">
								<div className="relative flex aspect-video w-[75%] items-center justify-center">
									<ScreenSharePanel />
								</div>
								<div className="flex w-[25%] flex-col justify-center gap-5 p-5">
									<UserVideoPanel stream={stream} muted={!isMicrophoneOn} />
									<UserVideoPanel stream={stream} muted={false} />
								</div>
							</div>
						) : (
							<ScrollArea className="w-full">
								<div className="grid h-full w-full grid-cols-2 items-center justify-center gap-4 overflow-y-auto border border-white p-5">
									<UserVideoPanel stream={stream} muted={!isMicrophoneOn} />
									{remoteStream && (
										<UserVideoPanel stream={remoteStream} muted={false} />
									)}
								</div>
							</ScrollArea>
						)} */}
					</div>
					<div className="h-[10vh] w-full md:h-[9vh]">
						<ControlPanel roomId={roomId} userId={userId!} />
					</div>

					<div className="absolute right-10 top-[15vh] z-40 w-1/6 bg-white">
						<h4>{remoteSocketId ? 'Connected' : 'No one in this Room'}</h4>
						{remoteSocketId && (
							<Button onClick={() => handleCallUser()}>Call</Button>
						)}

						{stream && <Button onClick={sendStreams}>Send Stream</Button>}
					</div>

					{remoteStream && (
						<div className="absolute bottom-[12vh] right-8 z-40 aspect-square w-[20%] resize rounded-xl border border-white sm:aspect-video md:bottom-[15vh] md:right-16 md:w-[12%]">
							<UserVideoPanel stream={stream} muted={true} />
						</div>
					)}
				</main>
			</div>
		</div>
	);
};

export default MeetRoom;