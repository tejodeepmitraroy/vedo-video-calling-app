'use client';
import React, { useEffect } from 'react';
import UserVideoPanel from '../components/UserVideoPanel';
import { useWebRTC } from '@/context/WebRTCContext';
import RemoteUserVideoPanel from '../components/RemoteUserVideoPanel';
import ControlPanel from '../components/ControlPanel';
import { useUser } from '@clerk/nextjs';
import useStreamStore from '@/store/useStreamStore';
import useDeviceStore from '@/store/useDeviceStore';
import useMeetingRoomSocket from '@/features/videoCall/hooks/useMeetingRoomSocket';

const MeetingRoom = ({ roomId }: { roomId: string }) => {
	const { streams, getUserMedia } = useWebRTC();
	const { user } = useUser();
	const localStream = useStreamStore((state) => state.localStream);
	const selectedCamera = useDeviceStore((state) => state.selectedCamera);
	const selectedMicrophone = useDeviceStore(
		(state) => state.selectedMicrophone
	);
	const selectedSpeaker = useDeviceStore((state) => state.selectedSpeaker);

	// Initialise socket listeners
	useMeetingRoomSocket();

	// Ensure we have a valid stream when entering meeting room
	useEffect(() => {
		const initializeMeetingStream = async () => {
			if (!localStream) {
				console.log('MeetingRoom: No local stream, getting new stream');
				getUserMedia({
					camera: selectedCamera.deviceId,
					microphone: selectedMicrophone.deviceId,
					speaker: selectedSpeaker.deviceId,
				});
				return;
			}

			// Check if stream tracks are ready
			const videoTracks = localStream.getVideoTracks();
			const audioTracks = localStream.getAudioTracks();

			if (videoTracks.length === 0 || audioTracks.length === 0) {
				console.log(
					'MeetingRoom: Stream tracks not available, getting new stream'
				);
				getUserMedia({
					camera: selectedCamera.deviceId,
					microphone: selectedMicrophone.deviceId,
					speaker: selectedSpeaker.deviceId,
				});
				return;
			}

			// More robust device comparison
			const currentVideoDeviceId = videoTracks[0]?.getSettings?.()?.deviceId;
			const currentAudioDeviceId = audioTracks[0]?.getSettings?.()?.deviceId;

			console.log('MeetingRoom: Device comparison:', {
				selectedCamera: selectedCamera.deviceId,
				currentVideoDeviceId,
				selectedMicrophone: selectedMicrophone.deviceId,
				currentAudioDeviceId,
				videoTrackReady: videoTracks[0]?.readyState,
				audioTrackReady: audioTracks[0]?.readyState,
			});

			// Only recreate stream if devices actually changed or tracks are not ready
			if (
				selectedCamera.deviceId !== currentVideoDeviceId ||
				selectedMicrophone.deviceId !== currentAudioDeviceId ||
				videoTracks[0]?.readyState !== 'live' ||
				audioTracks[0]?.readyState !== 'live'
			) {
				console.log(
					'MeetingRoom: Devices changed or tracks not ready, getting new stream'
				);
				getUserMedia({
					camera: selectedCamera.deviceId,
					microphone: selectedMicrophone.deviceId,
					speaker: selectedSpeaker.deviceId,
				});
			} else {
				console.log(
					'MeetingRoom: Stream is valid and devices match, no need to recreate'
				);
			}
		};

		// Add a small delay to ensure the component is fully mounted
		const timeoutId = setTimeout(() => {
			initializeMeetingStream();
		}, 100);

		return () => clearTimeout(timeoutId);
	}, [
		getUserMedia,
		localStream,
		selectedCamera.deviceId,
		selectedMicrophone.deviceId,
		selectedSpeaker.deviceId,
	]);

	console.log('Meeting Component mounted++++++++++');
	console.log('Streams available:', streams.length);
	console.log('Local stream available:', !!localStream, localStream);
	console.log('Selected camera:', selectedCamera.deviceId);
	console.log('Selected microphone:', selectedMicrophone.deviceId);

	// Log stream details for debugging
	if (streams.length > 0) {
		console.log('Remote streams details:');
		streams.forEach((stream, index) => {
			console.log(`Stream ${index}:`, {
				id: stream.id,
				active: stream.active,
				tracks: stream.getTracks().map((track) => ({
					kind: track.kind,
					label: track.label,
					enabled: track.enabled,
					readyState: track.readyState,
				})),
			});
		});
	}

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
