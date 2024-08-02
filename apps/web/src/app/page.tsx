'use client';
import useScreenStateStore from '@/store/useScreenStateStore';
import React, { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import NavBar from '@/components/Navbar';
import BottomNavigation from '@/components/BottomNavigation';
import Dashboard from './@dashboard/page';
// import CallRoom from './@callRoom/page';
import ConferenceRoom from './@conferenceRoom/page';
import { useSearchParams } from 'next/navigation';
import CallPanel from './@callerPanel/page';

const Home = () => {
	const currentState = useScreenStateStore((state) => state.currentScreen);
	const setCurrentState = useScreenStateStore(
		(state) => state.setCurrentScreen
	);
	const searchParams = useSearchParams();
	const roomId = searchParams.get('roomId');

	console.log('Room==========>', roomId);

	useEffect(() => {
		if (roomId) {
			setCurrentState('ConferenceRoom');
		} else {
			setCurrentState('Dashboard');
		}
	}, [roomId, setCurrentState]);

	console.log('Master Component');

	return (
		<div className="h-screen w-full bg-primary sm:grid md:pl-[55px]">
			<Sidebar />
			<div className="flex flex-col">
				<NavBar />
				<main className="relative flex w-full flex-1 flex-col gap-4 px-2 pb-20 md:pb-2 lg:gap-6">
					<>
						{currentState === 'Dashboard' && <Dashboard />}
						{/* {currentState === 'Call' && <CallRoom />} */}
						{currentState === 'Conference' && <ConferenceRoom />}
						{currentState === 'ConferenceRoom' && <CallPanel />}
					</>
				</main>
				<BottomNavigation />
			</div>
		</div>
	);
};

export default Home;
