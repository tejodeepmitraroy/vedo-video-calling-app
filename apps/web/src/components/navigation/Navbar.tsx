'use client';
import useScreenStateStore from '@/store/useScreenStateStore';
import React, { useCallback, useEffect } from 'react';
import { Github, Twitter } from 'lucide-react';
import Link from 'next/link';
import { useWebRTC } from '@/context/WebRTCContext';

const NavBar = () => {
	const currentState = useScreenStateStore((state) => state.currentScreen);
	const webRTC = useWebRTC();

	// Only try to use WebRTC if we're in a route where it's available
	const isRoomRoute =
		typeof window !== 'undefined'
			? window.location.pathname.startsWith('/room')
			: false;
	///////////////////////////////////////////////////////////////////////////////////////////////////

	// Get All Media Devices When Component Render
	const getDevices = useCallback(async () => {
		if (isRoomRoute && webRTC?.getAllMediaDevices) {
			try {
				await webRTC.getAllMediaDevices();
			} catch (error) {
				console.error('Error getting media devices:', error);
			}
		}
	}, [isRoomRoute, webRTC]);

	useEffect(() => {
		getDevices();
	}, [getDevices]);

	/////////////////////////////////////////////////////////////////////
	// Call Accept & Received
	// const callRejected = useCallback(
	// 	async (callerSocketId: string) => {
	// 		socketEmit('event:callRejected', { callerSocketId });
	// 	},
	// 	[socketEmit]
	// );

	// const callAccepted = useCallback(
	// 	async (callerSocketId: string) => {
	// 		socketEmit('event:callAccepted', { callerSocketId });
	// 	},
	// 	[socketEmit]
	// );

	//////////////////////////////////////////////////////////////////////

	// const handleAUserIsCalling = useCallback(
	// 	({
	// 		callerSocketId,
	// 		userName,
	// 	}: {
	// 		callerSocketId: string;
	// 		userName: string;
	// 	}) => {
	// 		toast(
	// 			<div className="w-full">
	// 				<div className="flex">
	// 					<div className="flex w-[20%] items-center justify-center">
	// 						{/* <Image
	// 						src={profilePic}
	// 						width={30}
	// 						height={30}
	// 						className="rounded-full"
	// 						alt={'Profile Pic'}
	// 					/> */}
	// 					</div>
	// 					<div className="w-[80%]">{userName} Want to Enter</div>
	// 				</div>
	// 				<div className="flex justify-evenly">
	// 					<Button
	// 						size={'sm'}
	// 						variant={'default'}
	// 						className=""
	// 						onClick={() => callAccepted(callerSocketId)}
	// 					>
	// 						<Phone />
	// 					</Button>
	// 					<Button
	// 						size={'sm'}
	// 						variant={'destructive'}
	// 						onClick={() => callRejected(callerSocketId)}
	// 					>
	// 						<PhoneOff />
	// 					</Button>
	// 				</div>
	// 			</div>
	// 		);
	// 	},
	// 	[callAccepted, callRejected]
	// );

	///////////////////////////////////////////////////////////////////////////
	// Events of Socket IO

	// const handleCallRejected = useCallback(() => {
	// 	toast.error('Call Rejected');
	// }, []);
	// const handleCallAccepted = useCallback(() => {
	// 	toast.success('Call Accepted');
	// }, []);

	///////////////////////////////////////////////////////////////////////////
	// Call Events and Notification
	// useEffect(() => {

	// 	// socketOn('notification:aUserIsCalling', handleAUserIsCalling);
	// 	// socketOn('notification:callRejected', handleCallRejected);
	// 	// socketOn('notification:callAccepted', handleCallAccepted);
	// 	return () => {

	// 		// socketOff('notification:aUserIsCalling', handleAUserIsCalling);
	// 		// socketOff('notification:callRejected', handleCallRejected);
	// 		// socketOff('notification:callAccepted', handleCallAccepted);
	// 	};
	// }, [socketOff, socketOn]);

	//////////////////////////////////////////////////////////////////////////////////////////////
	// const handleUserIsNotOnline = useCallback(() => {
	// 	toast.error(`User is Offline`);
	// }, []);

	// useEffect(() => {
	// 	socketOn('notification:userIsNotOnline', handleUserIsNotOnline);
	// 	return () => {
	// 		socketOff('notification:userIsNotOnline', handleUserIsNotOnline);
	// 	};
	// }, [handleUserIsNotOnline, socketOff, socketOn]);

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
