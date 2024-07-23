'use client';
import React from 'react';
import useRoomStore from '@/store/useRoomStore';
import OutsideLobby from './@outsideLobby/page';
import WaitingLobby from './@waitingLobby/page';
import MeetingRoom from './@meetingRoom/page';
import { useSearchParams } from 'next/navigation';

export default function CallPanel() {
	const roomState = useRoomStore((state) => state.roomState);

	const searchParams = useSearchParams();
	const roomId = searchParams.get('roomId');

	console.log('Component mounted');
	return (
		<>
			{roomState === 'waitingLobby' && <WaitingLobby roomId={roomId!} />}
			{roomState === 'meetingRoom' && <MeetingRoom roomId={roomId!} />}
			{roomState === 'outSideLobby' && <OutsideLobby />}
		</>
	);
}
