'use client';
import React, { useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import useScreenStateStore from '@/store/useScreenStateStore';
import useDeviceStore from '@/store/useDeviceStore';
import { useWebRTC } from '@/context/WebRTCContext';
import Dashboard from '../../@dashboard/page';
import MeetingRoom from '../../@meetingRoom/page';

const Room = () => {
	const currentScreen = useScreenStateStore((state) => state.currentScreen);
	const setCurrentScreen = useScreenStateStore(
		(state) => state.setCurrentScreen
	);

	const { roomId } = useParams<{ roomId: string }>();

	const selectedCamera = useDeviceStore((state) => state.selectedCamera);
	const selectedMicrophone = useDeviceStore(
		(state) => state.selectedMicrophone
	);
	const { getUserMedia, resetRemotePeers, getAllMediaDevices } = useWebRTC();

	////////////////////////////////////////////////////////////////////////////////////////////////////

	// Set User Media Stream
	const getMediaStream = useCallback(async () => {
		getUserMedia({
			camera: selectedCamera.deviceId,
			microphone: selectedMicrophone.deviceId,
		});
	}, [getUserMedia, selectedCamera, selectedMicrophone]);

	const stopMediaStream = useCallback(async () => {
		resetRemotePeers();
	}, [resetRemotePeers]);

	// useEffect(() => {
	// 	if (currentScreen === 'Waiting Lobby' || currentScreen === 'Meeting Room') {
	// 		getMediaStream();
	// 	} else {
	// 		console.log('currentScreen===============>', currentScreen);
	// 		stopMediaStream();
	// 	}
	// }, [currentScreen, getMediaStream, stopMediaStream]);

	/////////////////////////////////////////////////////////////////////////////////////////////////////

	// Get media devices once on mount
	useEffect(() => {
		getAllMediaDevices();
	}, [getAllMediaDevices]);

	// Refresh media stream whenever selected camera or microphone changes while user is in media screens
	useEffect(() => {
		if (
			(currentScreen === 'Waiting Lobby' || currentScreen === 'Meeting Room') &&
			(roomId || currentScreen === 'Meeting Room')
		) {
			getMediaStream();
		}
	}, [
		selectedCamera,
		selectedMicrophone,
		currentScreen,
		roomId,
		getMediaStream,
	]);

	useEffect(() => {
		if (roomId) {
			setCurrentScreen('Waiting Lobby');
			getMediaStream();
		} else {
			stopMediaStream();
		}
	}, [getMediaStream, roomId, setCurrentScreen, stopMediaStream]);
	return (
		<>
			<div className="flex h-full w-full">
				{currentScreen === 'Dashboard' && <Dashboard />}

				{/* {currentScreen === 'Waiting Lobby' && <WaitingLobby roomId={roomId!} />}
				{currentScreen === 'OutSide Lobby' && <OutsideLobby />} */}
			</div>

			{currentScreen === 'Meeting Room' && <MeetingRoom roomId={roomId} />}
		</>
	);
};

export default Room;
