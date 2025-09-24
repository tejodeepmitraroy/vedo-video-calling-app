'use client';
import React, { useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import useScreenStateStore from '@/store/useScreenStateStore';
import useDeviceStore from '@/store/useDeviceStore';
import { useWebRTC } from '@/context/WebRTCContext';
import MeetingRoom from '@/features/videoCall/screens/MeetingRoom';
import WaitingLobby from '@/features/videoCall/screens/WaitingLobby';
import OutsideLobby from '@/features/videoCall/screens/OutsideLobby';
import useMainRoomSockets from '@/features/videoCall/hooks/useMainRoomSockets';
import useStreamStore from '@/store/useStreamStore';

const Room = () => {
	const currentScreen = useScreenStateStore((state) => state.currentScreen);
	const { roomId } = useParams<{ roomId: string }>();

	const selectedCamera = useDeviceStore((state) => state.selectedCamera);
	const selectedMicrophone = useDeviceStore(
		(state) => state.selectedMicrophone
	);
	const selectedSpeaker = useDeviceStore((state) => state.selectedSpeaker);
	const { getUserMedia, resetRemotePeers } = useWebRTC();
	const localStream = useStreamStore((state) => state.localStream);

	useMainRoomSockets(roomId!);

	/////////////////////////////////////////////////////////////////////////

	// Set User Media Stream
	const getMediaStream = useCallback(async () => {
		console.log('Room: getMediaStream called with devices:', {
			camera: selectedCamera.deviceId,
			microphone: selectedMicrophone.deviceId,
			speaker: selectedSpeaker.deviceId,
			localStream,
		});

		try {
			if (
				selectedCamera.deviceId &&
				selectedMicrophone.deviceId &&
				selectedSpeaker.deviceId
			) {
				getUserMedia({
					camera: selectedCamera.deviceId,
					microphone: selectedMicrophone.deviceId,
					speaker: selectedSpeaker.deviceId,
				});
				console.log('Room: Media stream created successfully');
			} else {
				resetRemotePeers();
				console.log('Room: Invalid devices, cannot create media stream');
			}
		} catch (error) {
			console.error('Room: Error creating media stream:', error);
		}
	}, [
		getUserMedia,
		localStream,
		resetRemotePeers,
		selectedCamera.deviceId,
		selectedMicrophone.deviceId,
		selectedSpeaker.deviceId,
	]);

	const stopMediaStream = useCallback(async () => {
		console.log('Room: Stopping media stream');
		resetRemotePeers();
	}, [resetRemotePeers]);

	/////////////////////////////////////////////////////////////////////////////////////////////////////

	// Refresh media stream whenever selected camera or microphone changes while user is in media screens
	useEffect(() => {
		if (
			(currentScreen === 'Waiting Lobby' || currentScreen === 'Meeting Room') &&
			(roomId || currentScreen === 'Meeting Room') &&
			selectedCamera.deviceId !== null &&
			selectedCamera.deviceId !== undefined &&
			selectedMicrophone.deviceId !== null &&
			selectedMicrophone.deviceId !== undefined
		) {
			console.log(
				'Room: Device changed, refreshing stream for screen:',
				currentScreen
			);
			getMediaStream();
		}
	}, [
		selectedCamera.deviceId,
		selectedMicrophone.deviceId,
		currentScreen,
		roomId,
		getMediaStream,
	]);

	useEffect(() => {
		return () => {
			stopMediaStream();
		};
	}, [stopMediaStream]);
	return (
		<div className="flex h-full w-full">
			{currentScreen === 'Waiting Lobby' && <WaitingLobby roomId={roomId!} />}
			{currentScreen === 'Meeting Room' && <MeetingRoom roomId={roomId} />}
			{currentScreen === 'Outside Lobby' && <OutsideLobby />}
		</div>
	);
};

export default Room;
