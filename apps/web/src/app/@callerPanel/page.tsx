'use client';
import React, { useCallback, useEffect } from 'react';
import useRoomStore from '@/store/useRoomStore';
import OutsideLobby from './@outsideLobby/page';
import WaitingLobby from './@waitingLobby/page';
// import MeetingRoom from './@meetingRoom/page';
import { useSearchParams } from 'next/navigation';
import { useWebRTC } from '@/context/WebRTCContext';
import useDeviceStore from '@/store/useDeviceStore';
import useStreamStore from '@/store/useStreamStore';
import MeetingRoom from './@meetingRoom/page';

export default function CallPanel() {
	const roomState = useRoomStore((state) => state.roomState);
	const getRoomState = useRoomStore((state) => state.setRoomState);
	const selectedCamera = useDeviceStore((state) => state.selectedCamera);
	const selectedMicrophone = useDeviceStore(
		(state) => state.selectedMicrophone
	);
	const setLocalStream = useStreamStore((state) => state.setLocalStream);
	const searchParams = useSearchParams();
	const roomId = searchParams.get('roomId');
	const { getUserMedia, disconnectPeer } = useWebRTC();

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
		getMediaStream();
		return () => {
			stopMediaStream();
			getRoomState('waitingLobby');
		};
	}, [getMediaStream, getRoomState, stopMediaStream]);

	/////////////////////////////////////////////////////////////////////////////////////////////////////

	console.log('Caller Panel mounted++++++++++++++++++');
	return (
		<>
			{roomState === 'waitingLobby' && <WaitingLobby roomId={roomId!} />}
			{roomState === 'meetingRoom' && <MeetingRoom roomId={roomId!} />}
			{roomState === 'outSideLobby' && <OutsideLobby />}
		</>
	);
}
