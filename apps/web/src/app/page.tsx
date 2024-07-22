'use client';
import useScreenStateStore from '@/store/useScreenStateStore';
import React from 'react';
import Sidebar from '@/components/Sidebar';
import NavBar from '@/components/Navbar';
import BottomNavigation from '@/components/BottomNavigation';
import Dashboard from './@dashboard/page';
import CallRoom from './@callRoom/page';
import ConferenceRoom from './@conferenceRoom/page';
// import { useSearchParams } from 'next/navigation';
// import WaitingLobby from './room/[roomId]/@waitingLobby/page';

const Home = () => {
	const currentState = useScreenStateStore((state) => state.currentScreen);
	// const setCurrentState = useScreenStateStore(
	// 	(state) => state.setCurrentScreen
	// );
	// const searchParams = useSearchParams();
	// const [room, setRoom] = useState<string>('');

	// const roomId = searchParams.get('roomId');

	// console.log("Room==========>",roomId)

	// useEffect(() => {
	// 	if (roomId) {
	// 		setRoom(roomId);
	// 		setCurrentState('WaitingLobby');
	// 	}
	// }, [roomId, setCurrentState]);

	console.log('Component');

	return (
		<div className="grid h-screen w-full bg-primary md:pl-[55px]">
			<Sidebar />
			<div className="flex flex-col">
				<NavBar />
				<main className="flex h-full w-full flex-1 flex-col gap-4 pb-2 md:px-2 lg:gap-6">
					<>
						{currentState === 'Dashboard' && <Dashboard />}
						{currentState === 'Call' && <CallRoom />}
						{currentState === 'Conference' && <ConferenceRoom />}
						{/* {currentState === 'WaitingLobby' && <WaitingLobby roomId={room} />} */}
					</>
				</main>
			</div>
			<BottomNavigation />
		</div>
	);
};

export default Home;
