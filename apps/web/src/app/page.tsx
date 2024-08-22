'use client';
import useScreenStateStore from '@/store/useScreenStateStore';
import React, { useCallback, useEffect, useState } from 'react';
import Dashboard from './@dashboard/page';
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
import WaitingLobby from './@waitingLobby/page';
import MeetingRoom from './@meetingRoom/page';
import OutsideLobby from './@outsideLobby/page';
import useDeviceStore from '@/store/useDeviceStore';
import useStreamStore from '@/store/useStreamStore';
import Conference from './@conference/page';
import BottomNavigation from '@/components/BottomNavigation';
import { useWebRTC2 } from '@/context/WebRTCContext2';
// import useParticipantsStore from '@/store/useParticipantsStore';

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
	const currentScreen = useScreenStateStore((state) => state.currentScreen);
	const setCurrentScreen = useScreenStateStore(
		(state) => state.setCurrentScreen
	);
	const searchParams = useSearchParams();
	const roomId = searchParams.get('roomId');
	const { user } = useUser();
	const selectedCamera = useDeviceStore((state) => state.selectedCamera);
	const selectedMicrophone = useDeviceStore(
		(state) => state.selectedMicrophone
	);
	const setLocalStream = useStreamStore((state) => state.setLocalStream);
	const { getUserMedia, disconnectPeer } = useWebRTC2();
	// const onlineUsers = useParticipantsStore((state) => state.onlineUsers);

	////////////////////////////////////////////////////////////////////////////////////////////////////

	// Set User Media Stream
	const getMediaStream = useCallback(async () => {
		const mediaStream = await getUserMedia({
			camera: selectedCamera,
			microphone: selectedMicrophone,
		});
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
			// console.log('currentScreen===============>', currentScreen);
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

	// console.log('Master Component');

	const [open, setOpen] = useState(false);

	// useEffect(() => {
	// 	console.log('Online User=======>', onlineUsers);
	// }, [onlineUsers]);

	return (
		<>
			<div
				className={
					` ${currentScreen === 'Meeting Room' ? 'hidden' : ''} mx-auto flex h-screen w-full flex-1 flex-col bg-gray-100 dark:bg-neutral-800 md:flex-row` // for your use case, use `h-screen` instead of `h-[60vh]`
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

				<div className="h-full w-full bg-background md:pb-[50px]">
					<NavBar />
					<div className="flex h-full w-full flex-col justify-between">
						<div className="flex h-full w-full">
							{currentScreen === 'Dashboard' && <Dashboard />}
							{/* {currentState === 'Call' && <CallRoom />} */}
							{currentScreen === 'Conference' && <Conference />}
							{currentScreen === 'Waiting Lobby' && (
								<WaitingLobby roomId={roomId!} />
							)}
							{currentScreen === 'OutSide Lobby' && <OutsideLobby />}
						</div>
						<BottomNavigation />
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
