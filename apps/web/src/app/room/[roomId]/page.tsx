'use client';
import React from 'react';
import useRoomStore from '@/store/useRoomStore';
import WaitingLobby from './@waitingLobby/page';
import ConferenceRoom from './@conferenceRoom/page';
import OutsideLobby from './@outsideLobby/page';

export default function CallPanel({ params }: { params: { roomId: string } }) {
	const roomState = useRoomStore((state) => state.roomState);

	console.log('Component mounted');
	return (
		<>
			{roomState === 'waitingLobby' && <WaitingLobby roomId={params.roomId} />}
			{roomState === 'meetingRoom' && <ConferenceRoom roomId={params.roomId} />}
			{roomState === 'outSideLobby' && <OutsideLobby />}
		</>
	);
}
