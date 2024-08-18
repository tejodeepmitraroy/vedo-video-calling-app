'use client';
import useScreenStateStore from '@/store/useScreenStateStore';
import React, { useEffect, useState } from 'react';
// import Sidebar from '@/components/Sidebar';

import Dashboard from './@dashboard/page';
import ConferenceRoom from './@conferenceRoom/page';
import { useSearchParams } from 'next/navigation';
import CallPanel from './@callerPanel/page';
import {
	Sidebar,
	SidebarBody,
	SidebarButton,
	SidebarLink,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Laptop, HomeIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import UserProfile from '@/components/UserProfile';
import { useUser } from '@clerk/nextjs';
import NavBar from '@/components/Navbar';

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
	const currentState = useScreenStateStore((state) => state.currentScreen);
	const setCurrentState = useScreenStateStore(
		(state) => state.setCurrentScreen
	);
	const searchParams = useSearchParams();
	const roomId = searchParams.get('roomId');
	const { user } = useUser();

	console.log('Room==========>', roomId);

	useEffect(() => {
		if (roomId) {
			setCurrentState('ConferenceRoom');
		} else {
			setCurrentState('Dashboard');
		}
	}, [roomId, setCurrentState]);

	console.log('Master Component');

	const [open, setOpen] = useState(false);

	return (
		<div
			className={cn(
				// 'mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 md:flex-row',
				'mx-auto flex w-full flex-1 flex-col bg-gray-100 dark:bg-neutral-800 md:flex-row',
				'h-screen' // for your use case, use `h-screen` instead of `h-[60vh]`
			)}
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
					{currentState === 'Dashboard' && <Dashboard />}
					{/* {currentState === 'Call' && <CallRoom />} */}
					{currentState === 'Conference' && <ConferenceRoom />}
					{currentState === 'ConferenceRoom' && <CallPanel />}
				</div>
			</div>
		</div>

		// <div className="h-screen w-full overflow-y-hidden bg-primary sm:grid md:pl-[55px]">
		// 	<Sidebar />
		// 	<div className="flex h-full w-full flex-col">
		// 		<NavBar />
		// 		{/* <main className="relative flex h-full w-full flex-1 flex-col gap-4 px-2 pb-20 md:pb-2 lg:gap-6"> */}
		// 		<main className="relative flex h-full w-full flex-col gap-4  px-2 md:pb-2 lg:gap-6">
		// 			<>
		// 				{currentState === 'Dashboard' && <Dashboard />}
		// 				{/* {currentState === 'Call' && <CallRoom />} */}
		// 				{currentState === 'Conference' && <ConferenceRoom />}
		// 				{currentState === 'ConferenceRoom' && <CallPanel />}
		// 			</>
		// 		</main>
		// 		<BottomNavigation />
		// 	</div>
		// </div>
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
