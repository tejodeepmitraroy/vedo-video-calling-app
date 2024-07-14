'use client';
import React from 'react';
import useRoomStore from '@/store/useRoomStore';
import WaitingLobby from './Screens/WaitingLobby';
import MeetRoom from './Screens/MeetRoom';
import OutsideLobby from './Screens/OutsideLobby';

export default function CallPanel({ params }: { params: { roomId: string } }) {
	const roomState = useRoomStore((state) => state.roomState);
	console.log('Component mounted');
	return (
		<>
			{roomState === 'waitingLobby' && <WaitingLobby roomId={params.roomId} />}
			{roomState === 'meetingRoom' && <MeetRoom roomId={params.roomId} />}
			{roomState === 'outSideLobby' && <OutsideLobby />}
		</>
	);
}
