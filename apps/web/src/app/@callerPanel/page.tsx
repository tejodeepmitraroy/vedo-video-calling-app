'use client';
import React, { useCallback, useEffect } from 'react';
import { useWebRTC } from '@/context/WebRTCContext';
import useDeviceStore from '@/store/useDeviceStore';
import useStreamStore from '@/store/useStreamStore';

export default function CallPanel() {
	const selectedCamera = useDeviceStore((state) => state.selectedCamera);
	const selectedMicrophone = useDeviceStore(
		(state) => state.selectedMicrophone
	);
	const setLocalStream = useStreamStore((state) => state.setLocalStream);

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
		};
	}, [getMediaStream, stopMediaStream]);

	/////////////////////////////////////////////////////////////////////////////////////////////////////

	console.log('Caller Panel mounted++++++++++++++++++');
	return <></>;
}
