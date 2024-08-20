'use client';
import useScreenStateStore from '@/store/useScreenStateStore';
import React, { useCallback, useEffect, useState } from 'react';
// import Sidebar from '@/components/Sidebar';

import Dashboard from './@dashboard/page';
// import ConferenceRoom from './@conferenceRoom/page';
import { useSearchParams } from 'next/navigation';
import {
	Sidebar,
	SidebarBody,
	SidebarButton,
	SidebarLink,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';
import { Laptop, HomeIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import UserProfile from '@/components/UserProfile';
import { useUser } from '@clerk/nextjs';
import NavBar from '@/components/Navbar';
// import useRoomStore from '@/store/useRoomStore';
import WaitingLobby from './@callerPanel/@waitingLobby/page';
import MeetingRoom from './@callerPanel/@meetingRoom/page';
import ConferenceRoom from './@conferenceRoom/page';
import OutsideLobby from './@callerPanel/@outsideLobby/page';
import useDeviceStore from '@/store/useDeviceStore';
import useStreamStore from '@/store/useStreamStore';
import { useWebRTC } from '@/context/WebRTCContext';

const screens = [
	{
		label: 'Dashboard',
		screen: 'Dashboard',
		icon: <HomeIcon className="h-6 w-6 flex-shrink-0 dark:text-neutral-200" />,
	},
	{
		label: 'Conference',
		screen: 'Conference',
		icon: <Laptop className="h-6 w-6 flex-shrink-0 dark:text-neutral-200" />,
	},
];

const Home = () => {
	// const roomState = useRoomStore((state) => state.roomState);
	const currentScreen = useScreenStateStore((state) => state.currentScreen);
	const setCurrentScreen = useScreenStateStore(
		(state) => state.setCurrentScreen
	);
	const searchParams = useSearchParams();
	const roomId = searchParams.get('roomId');
	const { user } = useUser();
	// const getRoomState = useRoomStore((state) => state.setRoomState);
	const selectedCamera = useDeviceStore((state) => state.selectedCamera);
	const selectedMicrophone = useDeviceStore(
		(state) => state.selectedMicrophone
	);
	const setLocalStream = useStreamStore((state) => state.setLocalStream);

	const { getUserMedia, disconnectPeer } = useWebRTC();

	console.log('Room==========>', roomId);

	////////////////////////////////////////////////////////////////////////////////////////////////////

	// Set User Media Stream
	const getMediaStream = useCallback(async () => {
		const mediaStream = await getUserMedia({
			camera: selectedCamera,
			microphone: selectedMicrophone,
		});
		console.log('Media Stream in Waiting room ------------->>>', mediaStream);
		setLocalStream(mediaStream!);
	}, [getUserMedia, selectedCamera, selectedMicrophone, setLocalStream]);

	const stopMediaStream = useCallback(async () => {
		disconnectPeer();
		setLocalStream(null);
	}, [disconnectPeer, setLocalStream]);

	useEffect(() => {
		if (currentScreen === 'Waiting Lobby' || currentScreen === 'Meeting Room') {
			getMediaStream();
		} else {
			// stopMediaStream();
		}
	}, [currentScreen, getMediaStream, stopMediaStream]);

	/////////////////////////////////////////////////////////////////////////////////////////////////////

	useEffect(() => {
		if (roomId) {
			setCurrentScreen('Waiting Lobby');
		} else {
			setCurrentScreen('Dashboard');
		}
	}, [roomId, setCurrentScreen]);

	console.log('Master Component');

	const [open, setOpen] = useState(false);

	return (
		<>
			<div
				// className={cn(
				// 	// 'mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 md:flex-row',
				// 	` ${currentScreen === 'Waiting Lobby' ? 'hidden bg-blue-700' : ''} mx-auto flex w-full flex-1 flex-col bg-gray-100 dark:bg-neutral-800 md:flex-row`,
				// 	`h-screen` // for your use case, use `h-screen` instead of `h-[60vh]`
				// )}
				className={
					` ${currentScreen === 'Meeting Room' ? 'hidden bg-blue-700' : ''} mx-auto flex h-screen w-full flex-1 flex-col bg-gray-100 dark:bg-neutral-800 md:flex-row` // for your use case, use `h-screen` instead of `h-[60vh]`
				}
			>
				<Sidebar open={open} setOpen={setOpen}>
					<SidebarBody className="justify-between gap-10">
						<div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
							<>
								<Logo />
							</>
							<div className="mt-8 flex flex-col gap-2">
								{screens.map((screen, idx) => (
									<SidebarButton key={idx} screen={screen} />
								))}
							</div>
						</div>
						<div>
							<SidebarLink
								className="pl-2"
								link={{
									label: user?.fullName ? user.fullName : '',
									href: '#',
									icon: <UserProfile />,
								}}
							/>
						</div>
					</SidebarBody>
				</Sidebar>

				<div className="h-full w-full bg-background pb-[55px]">
					<NavBar />
					<div className="h-full w-full">
						{currentScreen === 'Dashboard' && <Dashboard />}
						{/* {currentState === 'Call' && <CallRoom />} */}
						{currentScreen === 'Conference' && <ConferenceRoom />}
						{currentScreen === 'Waiting Lobby' && (
							<WaitingLobby roomId={roomId!} />
						)}
						{currentScreen === 'OutSide Lobby' && <OutsideLobby />}
					</div>
				</div>
			</div>
			{currentScreen === 'Meeting Room' && <MeetingRoom roomId={roomId!} />}
		</>
	);
};

export default Home;

export const Logo = () => {
	return (
		<Link
			href=""
			className="relative z-20 flex items-center space-x-2 py-1 pl-2 text-sm font-normal text-black"
		>
			<Image
				src="/icon-512x512.png"
				className="h-7 w-7 flex-shrink-0 rounded-full"
				width={50}
				height={50}
				alt="Avatar"
			/>

			<motion.span
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="whitespace-pre font-medium text-black dark:text-white"
			>
				VEDO - Video CAll
			</motion.span>
		</Link>
	);
};
