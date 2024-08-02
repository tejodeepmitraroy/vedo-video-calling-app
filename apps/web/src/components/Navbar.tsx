'use client';
import { useSocket } from '@/context/SocketContext';
import useScreenStateStore from '@/store/useScreenStateStore';
import React, { useCallback, useEffect } from 'react';
import { Button } from './ui/button';
import { toast } from 'react-toastify';
import useGlobalStore from '@/store/useGlobalStore';
import { useAuth, useUser } from '@clerk/nextjs';
import { Phone, PhoneOff } from 'lucide-react';

import useDeviceStore from '@/store/useDeviceStore';
import { useWebRTC } from '@/context/WebRTCContext';
import useRoomStore from '@/store/useRoomStore';
import { useSearchParams } from 'next/navigation';

const NavBar = () => {
	const { userId } = useAuth();
	const { user } = useUser();
	const currentState = useScreenStateStore((state) => state.currentScreen);
	const setOnLineStatus = useGlobalStore((state) => state.setOnLineStatus);
	const roomState = useRoomStore((state) => state.roomState);

	const { socket, socketOn, socketOff, socketEmit } = useSocket();
	const setMediaDevices = useDeviceStore((state) => state.setMediaDevices);

	const { getAllMediaDevices } = useWebRTC();
	const searchParams = useSearchParams();
	const roomId = searchParams.get('roomId');
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
				setOnLineStatus(true);
			} else {
				toast.error('Not Connected');
				setOnLineStatus(false);
			}
		} else {
			toast.info('Connecting with server');
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
				</div>,
				{
					// onClose: () => roomEnterPermissionDenied(socketId),
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

	return (
		<header className="sticky top-0 z-10 flex h-[55px] items-center gap-1 px-4">
			<h1 className="text-lg font-semibold text-white md:text-2xl">
				{roomState === 'meetingRoom' ? roomId! : currentState}
			</h1>
		</header>
	);
};

export default NavBar;
