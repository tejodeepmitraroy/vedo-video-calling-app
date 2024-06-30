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

const MeetRoom = ({roomId}:{roomId: string}) => {
	const stream = useRoomStore((state) => state.stream);
	const screenStream = useRoomStore((state) => state.screenStream);
	const isMicrophoneOn = useRoomStore((state) => state.isMicrophoneOn);
	const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
	const [remoteStream, setRemoteStream] = useState<MediaStream>();

	const router = useRouter();
	const { getToken, userId } = useAuth();

	const { socket, socketOn, socketEmit, socketOff } = useSocket();

	const handleUserJoined = useCallback(
		({ userId, id }: { userId: string; id: string }) => {
			console.log('User Joined', userId);
			console.log('Socket User Joined', id);
			setRemoteSocketId(id);
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
		[socket]
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
			socket?.off('event:UserJoined', handleUserJoined);
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

	// useEffect(() => {
	// 	const url = window.location.href;
	// 	toast(
	// 		<div className="">
	// 			<span>Share Url</span>
	// 			<div>
	// 				<RWebShare
	// 					data={{
	// 						text: 'Like humans, flamingos make friends for life',
	// 						url,
	// 						title: 'Room Id',
	// 					}}
	// 					onClick={() => console.log('shared successfully!')}
	// 				>
	// 					<Button>Share 🔗</Button>
	// 				</RWebShare>
	// 			</div>
	// 		</div>,
	// 		{
	// 			position: 'top-right',
	// 			autoClose: false,
	// 			hideProgressBar: false,
	// 			closeOnClick: true,
	// 			pauseOnHover: true,
	// 			draggable: true,
	// 			progress: undefined,
	// 			theme: 'light',
	// 		}
	// 	);
	// }, []);

	// const handleEnterRoom = useCallback(async () => {
	// 	const token = await getToken();
	// 	console.log('Enter Room number', roomId);

	// 	console.log('User Id', userId);

	// 	if (roomId) {
	// 		try {
	// 			const { data } = await toast.promise(
	// 				axios(
	// 					`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/call/${roomId}`,

	// 					{
	// 						headers: {
	// 							'Content-Type': 'application/json',
	// 							Authorization: `Bearer ${token}`,
	// 						},
	// 					}
	// 				),

	// 				{
	// 					pending: `Hold no, we're Connecting`,
	// 					success: 'Connection succesfull👌',
	// 					error: 'Connection rejected 🤯',
	// 				}
	// 			);

	// 			console.log(data);
	// 			const response = data.data;

	// 			if (response) {
	// 				const roomId = data.data.meetingId;

	// 				socketEmit('event:joinRoom', { roomId, userId });

	// 				// router.push(response.videoCallUrl);
	// 			} else {
	// 				toast.error('RoomId Does not Exists');
	// 				// router.push('/');
	// 			}
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	}
	// }, [getToken, roomId, socketEmit, userId]);

	// useEffect(() => {
	// 	handleEnterRoom();

	// 	return () => {
	// 		handleEnterRoom();
	// 	};
	// }, [handleEnterRoom]);
	return (
		<div className="flex h-screen w-full flex-col bg-muted/40">
			{/* <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
				<nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
					<Link
						href="/"
						className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
					>
						<Video className="h-4 w-4 transition-all group-hover:scale-110" />
						<span className="sr-only">Acme Inc</span>
					</Link>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href="/"
									className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
								>
									<Home className="h-5 w-5" />
									<span className="sr-only">Dashboard</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right">Dashboard</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href="#"
									className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
								>
									<MessagesSquare className="h-5 w-5" />
									<span className="sr-only">Orders</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right">Orders</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href="#"
									className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
								>
									<Package className="h-5 w-5" />
									<span className="sr-only">Products</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right">Products</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href="#"
									className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
								>
									<Users2 className="h-5 w-5" />
									<span className="sr-only">Customers</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right">Customers</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href="#"
									className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
								>
									<LineChart className="h-5 w-5" />
									<span className="sr-only">Analytics</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right">Analytics</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</nav>
				<nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								{/* <Link
									href="#"
									className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
								>
									<Settings className="h-5 w-5" />
									<span className="sr-only">Settings</span>
								</Link> 
								<UserProfile />
							</TooltipTrigger>
							<TooltipContent side="right">Settings</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</nav>
			</aside> */}
			<div className="relative flex h-screen w-full flex-col">
				{/* <header className="fixed top-0 z-30 flex h-14 w-full items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
					<Sheet>
						<SheetTrigger asChild>
							<Button size="icon" variant="outline" className="sm:hidden">
								<PanelLeft className="h-5 w-5" />
								<span className="sr-only">Toggle Menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="sm:max-w-xs">
							<nav className="grid gap-6 text-lg font-medium">
								<Link
									href="/"
									className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
								>
									<Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
									<span className="sr-only">Acme Inc</span>
								</Link>
								<Link
									href="/"
									className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
								>
									<Home className="h-5 w-5" />
									Dashboard
								</Link>
								<Link
									href="#"
									className="flex items-center gap-4 px-2.5 text-foreground"
								>
									<ShoppingCart className="h-5 w-5" />
									Orders
								</Link>
								<Link
									href="#"
									className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
								>
									<Package className="h-5 w-5" />
									Products
								</Link>
								<Link
									href="#"
									className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
								>
									<Users2 className="h-5 w-5" />
									Customers
								</Link>
								<Link
									href="#"
									className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
								>
									<LineChart className="h-5 w-5" />
									Settings
								</Link>
							</nav>
						</SheetContent>
					</Sheet>
				</header> */}
				<main className="relative h-full w-full overflow-hidden">
					<div className="flex h-[91vh] w-full items-center justify-center bg-black md:p-7">
						<div className="absolute top-2 rounded-xl bg-white p-5 text-black">
							{roomId}
						</div>
						<div className="h-full w-full max-w-[85rem] rounded-xl sm:aspect-video sm:border-2 sm:border-white">
							{remoteStream && (
								<UserVideoPanel stream={remoteStream} muted={false} />
							)}

							{/* {remoteStream ? (
								<UserVideoPanel stream={remoteStream} muted={false} />
							) : (
								<UserVideoPanel stream={stream} muted={!isMicrophoneOn} />
							)} */}
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
						<ControlPanel />
					</div>

					<div className="absolute right-10 top-[15vh] z-40 w-1/6 bg-white">
						<h4>{remoteSocketId ? 'Connected' : 'No one in this Room'}</h4>
						{remoteSocketId && (
							<Button onClick={() => handleCallUser()}>Call</Button>
						)}

						{/* {stream && <Button onClick={sendStreams}>Send Stream</Button>} */}
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
