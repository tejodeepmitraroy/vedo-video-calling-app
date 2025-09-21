'use client';
import React from 'react';
import UserVideoPanel from '../components/UserVideoPanel';
import { useWebRTC } from '@/context/WebRTCContext';
import RemoteUserVideoPanel from '../components/RemoteUserVideoPanel';
import ControlPanel from '../components/ControlPanel';
import { useUser } from '@clerk/nextjs';
// import { MonitorUp } from 'lucide-react';
// import { Button } from '@/components/ui/button';
import useStreamStore from '@/store/useStreamStore';
import useMeetingRoomSocket from '@/hooks/useMeetingRoomSocket';

const MeetingRoom = ({ roomId }: { roomId: string }) => {
	const { streams } = useWebRTC();
	const { user } = useUser();
	const localStream = useStreamStore((state) => state.localStream);

	// Initialise socket listeners
	useMeetingRoomSocket();

	console.log('Meeting Component mounted++++++++++');
	console.log('Streams available:', streams.length);
	console.log('Local stream available:', !!localStream);

	return (
		<main className="relative flex h-screen w-full overflow-hidden bg-[#222831]">
			<div className="h-full w-full flex-col justify-between gap-4 p-4 px-4 pb-20 sm:pb-4 md:pb-20">
				{/* <div className="flex items-center justify-between">
					<span className="flex items-center gap-2">
						<MonitorUp size={'20'} />
						Tejodeep Mitra Roy (You, presenting)
					</span>
					<Button size={'sm'}>Stop presenting</Button>
				</div> */}

				{/* Video Layout based on number of streams */}
				{streams.length === 0 && (
					<div className="relative grid h-full w-full grid-cols-1">
						<div className="mx-auto flex h-full w-full items-center justify-center gap-5 md:max-w-[90rem]">
							<UserVideoPanel />
							<span className="absolute bottom-3 left-4 z-40 rounded-lg text-xs font-semibold text-white sm:text-base">
								{user?.fullName}
							</span>
						</div>
					</div>
				)}

				{streams.length >= 1 && (
					<div className="relative grid h-full w-full grid-cols-1">
						<div className="mx-auto flex w-full flex-col items-center justify-center gap-5 md:max-w-[90rem] md:flex-row">
							{streams.map((stream, index) => (
								<RemoteUserVideoPanel key={`remote-${index}`} stream={stream} />
							))}
						</div>
						<div className="absolute bottom-[7vh] right-3 z-40 h-24 w-[20%] resize rounded-lg sm:aspect-video sm:h-auto md:bottom-[3vh] md:right-8 md:w-[20%] lg:right-14 lg:w-[12%]">
							<UserVideoPanel />
						</div>
					</div>
				)}
			</div>

			<ControlPanel roomId={roomId} />
		</main>
	);
};

export default MeetingRoom;
