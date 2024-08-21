'use client';
import { useSocket } from '@/context/SocketContext';
import useScreenStateStore from '@/store/useScreenStateStore';
import React, { useCallback, useEffect } from 'react';
import { Button } from './ui/button';
// import { toast } from 'react-toastify';
import toast from 'react-hot-toast';
import useGlobalStore from '@/store/useGlobalStore';
import { useAuth, useUser } from '@clerk/nextjs';
import { Github, Phone, PhoneOff, Twitter } from 'lucide-react';
import useDeviceStore from '@/store/useDeviceStore';
import { useWebRTC } from '@/context/WebRTCContext';
import Link from 'next/link';
import useStreamStore from '@/store/useStreamStore';

const NavBar = () => {
	const { userId } = useAuth();
	const { user } = useUser();
	const currentState = useScreenStateStore((state) => state.currentScreen);
	const setOnLineStatus = useGlobalStore((state) => state.setOnLineStatus);
	const { socket, socketOn, socketOff, socketEmit } = useSocket();
	const setMediaDevices = useDeviceStore((state) => state.setMediaDevices);
	const setCurrentScreen = useScreenStateStore(
		(state) => state.setCurrentScreen
	);
	const setLocalStream = useStreamStore((state) => state.setLocalStream);
	const setRemoteSocketId = useStreamStore((state) => state.setRemoteSocketId);

	const { getAllMediaDevices, disconnectPeer, resetRemotePeer } = useWebRTC();

	/////////////////////////////////////////////////////////////////////////////////////////////////////////

	const handleUserLeftTheRoom = useCallback(
		({ userId: id }: { userId: string }) => {
			if (id === userId) {
				toast.success(`You Left the Room`);
				setLocalStream(null);
				disconnectPeer();
				setCurrentScreen('OutSide Lobby');
			} else {
				setRemoteSocketId(null);
				toast(`${id} Left the Room`);
				resetRemotePeer();
			}
		},
		[
			disconnectPeer,
			resetRemotePeer,
			setCurrentScreen,
			setLocalStream,
			setRemoteSocketId,
			userId,
		]
	);

	const handleRemoveEveryoneFromRoom = useCallback(async () => {
		toast.success(`Host End the Room`);
		disconnectPeer();
		setCurrentScreen('OutSide Lobby');
	}, [disconnectPeer, setCurrentScreen]);

	//All Notifications Event state here
	useEffect(() => {
		socketOn('notification:userLeftTheRoom', handleUserLeftTheRoom);
		socketOn('event:removeEveryoneFromRoom', handleRemoveEveryoneFromRoom);

		return () => {
			socketOff('notification:userLeftTheRoom', handleUserLeftTheRoom);
			socketOff('event:removeEveryoneFromRoom', handleRemoveEveryoneFromRoom);
		};
	}, [
		handleRemoveEveryoneFromRoom,
		handleUserLeftTheRoom,
		socketOff,
		socketOn,
	]);

	///////////////////////////////////////////////////////////////////////////////////////////////////

	// Get All Media Devices When Component Render
	const getDevices = useCallback(async () => {
		const device = await getAllMediaDevices();
		setMediaDevices(device);
		console.log('Devices=========>', device);
	}, [getAllMediaDevices, setMediaDevices]);

	useEffect(() => {
		getDevices();
		return () => {
			getDevices();
		};
	}, [getDevices]);

	/////////////////////////////////////////////////////////////////////
	// Connect User With Server
	const handleUserConnected = useCallback(() => {
		if (socket) {
			if (socket.connected) {
				toast.success('Connected');
				toast.dismiss();

				setOnLineStatus(true);
			} else {
				toast.error('Not Connected');
				setOnLineStatus(false);
			}
		} else {
			toast.loading('Connecting with server');
		}
	}, [setOnLineStatus, socket]);

	////// Conference Rooms all Socket Notification👇
	/////////////////////////////////////////////////////////////////////

	//// All socket Notification Function are Define Here
	/////////////////////////////////////////////////////
	const handleInformAllNewUserAdded = useCallback(
		({ userId: id, username }: { userId: string; username: string }) => {
			console.log('Notiof', { userId, username });

			if (id === userId) {
				toast.success(`suceesfully joined`);
			} else {
				toast(`${username} Joined`);
			}
		},
		[userId]
	);
	const handleRoomIsFull = useCallback(async () => {
		toast.loading(`roomIsFull`);
	}, []);

	// Meeting Rooms notification👇
	////////////////////////////////////////////////////////////

	useEffect(() => {
		socketOn('notification:informAllNewUserAdded', handleInformAllNewUserAdded);

		return () => {
			socketOff(
				'notification:informAllNewUserAdded',
				handleInformAllNewUserAdded
			);
		};
	}, [handleInformAllNewUserAdded, handleRoomIsFull, socketOff, socketOn]);

	/////////////////////////////////////////////////////////////////////
	// Call Accept & Received
	const callRejected = useCallback(
		async (callerSocketId: string) => {
			socketEmit('event:callRejected', { callerSocketId });
		},
		[socketEmit]
	);

	const callAccepted = useCallback(
		async (callerSocketId: string) => {
			socketEmit('event:callAccepted', { callerSocketId });
		},
		[socketEmit]
	);

	//////////////////////////////////////////////////////////////////////

	const handleAUserIsCalling = useCallback(
		({
			callerSocketId,
			userName,
		}: {
			callerSocketId: string;
			userName: string;
		}) => {
			toast(
				<div className="w-full">
					<div className="flex">
						<div className="flex w-[20%] items-center justify-center">
							{/* <Image
							src={profilePic}
							width={30}
							height={30}
							className="rounded-full"
							alt={'Profile Pic'}
						/> */}
						</div>
						<div className="w-[80%]">{userName} Want to Enter</div>
					</div>
					<div className="flex justify-evenly">
						<Button
							size={'sm'}
							variant={'default'}
							className=""
							onClick={() => callAccepted(callerSocketId)}
						>
							<Phone />
						</Button>
						<Button
							size={'sm'}
							variant={'destructive'}
							onClick={() => callRejected(callerSocketId)}
						>
							<PhoneOff />
						</Button>
					</div>
				</div>
			);
		},
		[callAccepted, callRejected]
	);

	///////////////////////////////////////////////////////////////////////////
	// Events of Socket IO

	const handleCallRejected = useCallback(() => {
		toast.error('Call Rejected');
	}, []);
	const handleCallAccepted = useCallback(() => {
		toast.success('Call Accepted');
	}, []);

	///////////////////////////////////////////////////////////////////////////
	// Call Events and Notification
	useEffect(() => {
		socketOn('userConnected', handleUserConnected);
		socketOn('notification:aUserIsCalling', handleAUserIsCalling);
		socketOn('notification:callRejected', handleCallRejected);
		socketOn('notification:callAccepted', handleCallAccepted);
		return () => {
			socketOff('userConnected', handleUserConnected);
			socketOff('notification:aUserIsCalling', handleAUserIsCalling);
			socketOff('notification:callRejected', handleCallRejected);
			socketOff('notification:callAccepted', handleCallAccepted);
		};
	}, [
		handleAUserIsCalling,
		handleCallAccepted,
		handleCallRejected,
		handleUserConnected,
		socketOff,
		socketOn,
	]);

	///////////////////////////////////////////////////////////////////////////////////

	const handleGetOnlineUser = useCallback(
		({
			users,
		}: {
			users: {
				userId: string;
				fullName: string;
				imageUrl: string;
				emailAddress: string;
			}[];
		}) => {
			console.log('Get Online User Details========>', {
				users,
			});
		},
		[]
	);
	///////////////////////////////////////////////////////////////////////////////////

	useEffect(() => {
		if (user) {
			toast.loading('Connecting with server');
			socketEmit('connectWithUser', {
				userId: user.id,
				fullName: user.fullName,
				imageUrl: user.imageUrl,
				emailAddress: user.emailAddresses[0]
					? user.emailAddresses[0].emailAddress
					: '',
			});
		}
	}, [socket, socketEmit, user]);

	useEffect(() => {
		socketOn('getOnlineUsers', handleGetOnlineUser);
		return () => {
			socketOff('getOnlineUsers', handleGetOnlineUser);
		};
	}, [handleGetOnlineUser, socketOff, socketOn]);

	//////////////////////////////////////////////////////////////////////////////////////////////
	const handleUserIsNotOnline = useCallback(() => {
		toast.error(`User is Offline`);
	}, []);

	useEffect(() => {
		socketOn('notification:userIsNotOnline', handleUserIsNotOnline);
		return () => {
			socketOff('notification:userIsNotOnline', handleUserIsNotOnline);
		};
	}, [handleUserIsNotOnline, socketOff, socketOn]);

	return (
		<header className="relative hidden h-[50px] items-center justify-between gap-1 bg-neutral-100 px-4 md:flex md:h-[50px]">
			<h1 className="text-xl font-semibold text-primary md:text-2xl">
				{currentState}
			</h1>
			<div className="flex items-center gap-2 pr-10">
				<Link href={'https://x.com/tezomon_dev'}>
					<div className="rounded-full border border-black bg-slate-100 p-1.5">
						<Twitter size={15} className="text-black" fill={'black'} />
					</div>
				</Link>
				<Link
					href={'https://github.com/tejodeepmitraroy/vedo-video-calling-app'}
				>
					<div className="rounded-full border border-black bg-slate-100 p-1.5">
						<Github size={15} className=" " />
					</div>
				</Link>
			</div>
		</header>
	);
};

export default NavBar;
