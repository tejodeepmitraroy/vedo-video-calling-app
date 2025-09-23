'use client';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useSocket } from '@/context/SocketContext';
import { RWebShare } from 'react-web-share';
import Spinner from '@/components/ui/spinner';
import dynamic from 'next/dynamic';
import UserVideoPanel from '@/features/videoCall/components/UserVideoPanel';
import useGlobalStore from '@/store/useGlobalStore';
import MediaSettings from '@/features/videoCall/components/MediaSettings';
import useDeviceStore from '@/store/useDeviceStore';
import { useWebRTC } from '@/context/WebRTCContext';
import useStreamStore from '@/store/useStreamStore';
import useWaitingLobbySocket from '@/features/videoCall/hooks/useWaitingLobbySocket';

const MediaControls = dynamic(() => import('../components/MediaControls'));

const WaitingLobby = ({ roomId }: { roomId: string }) => {
	const { socketOn, socketOff } = useSocket();
	const roomDetails = useGlobalStore((state) => state.roomDetails);
	const [canJoin, setCanJoin] = useState<boolean>();
	const { getUserMedia, getAllMediaDevices } = useWebRTC();
	const selectedCamera = useDeviceStore((state) => state.selectedCamera);
	const selectedMicrophone = useDeviceStore(
		(state) => state.selectedMicrophone
	);
	const selectedSpeaker = useDeviceStore((state) => state.selectedSpeaker);
	const localStream = useStreamStore((state) => state.localStream);

	// Initialize media devices and get user media when component mounts
	useEffect(() => {
		const initializeMedia = async () => {
			console.log('WaitingLobby: Initializing media');
			console.log('Selected camera:', selectedCamera.deviceId);
			console.log('Selected microphone:', selectedMicrophone.deviceId);

			await getAllMediaDevices();

			// Check if we need to get new media
			const currentVideoTrack = localStream?.getVideoTracks()[0];
			const currentAudioTrack = localStream?.getAudioTracks()[0];
			const currentVideoDeviceId = currentVideoTrack?.getSettings?.()?.deviceId;
			const currentAudioDeviceId = currentAudioTrack?.getSettings?.()?.deviceId;

			console.log('Current stream devices:', {
				currentVideoDeviceId,
				currentAudioDeviceId,
			});
			console.log(
				'Stream video track readyState:',
				currentVideoTrack?.readyState
			);
			console.log(
				'Stream audio track readyState:',
				currentAudioTrack?.readyState
			);

			// Always get user media when entering WaitingLobby to ensure we have the correct devices
			// This ensures that if user changed devices in MeetingRoom and came back, we get the right stream
			const needsNewStream =
				!localStream ||
				selectedCamera.deviceId !== currentVideoDeviceId ||
				selectedMicrophone.deviceId !== currentAudioDeviceId ||
				currentVideoTrack?.readyState !== 'live' ||
				currentAudioTrack?.readyState !== 'live' ||
				!currentVideoDeviceId || // Force refresh if we don't have current device info
				!currentAudioDeviceId;

			if (needsNewStream) {
				console.log('WaitingLobby: Getting new stream with devices:', {
					camera: selectedCamera.deviceId,
					microphone: selectedMicrophone.deviceId,
				});
				// Stop current stream if it exists
				if (localStream) {
					console.log(
						'WaitingLobby: Stopping current stream before creating new one'
					);
					localStream.getTracks().forEach((track) => track.stop());
				}
				getUserMedia({
					camera: selectedCamera.deviceId,
					microphone: selectedMicrophone.deviceId,
					speaker: selectedSpeaker.deviceId,
				});
			} else {
				console.log('WaitingLobby: Using existing stream');
			}
		};

		initializeMedia();

		// Cleanup function to stop tracks when component unmounts
		return () => {
			console.log('WaitingLobby: Cleaning up media');
			if (localStream) {
				localStream.getTracks().forEach((track) => track.stop());
			}
		};
	}, [
		getAllMediaDevices,
		getUserMedia,
		localStream,
		selectedCamera.deviceId,
		selectedMicrophone.deviceId,
		selectedSpeaker.deviceId,
	]);

	console.log('Waiting Component mounted++++++++++');

	//// Previously joined User
	const handleDirectlyCanJoin = useCallback(
		({ directlyCanJoin }: { directlyCanJoin: boolean }) => {
			setCanJoin(directlyCanJoin);
		},
		[]
	);
	useEffect(() => {
		socketOn('event:directlyCanJoin', handleDirectlyCanJoin);
		return () => {
			socketOff('event:directlyCanJoin', handleDirectlyCanJoin);
		};
	}, [handleDirectlyCanJoin, socketOff, socketOn]);

	const { handleJoinRoom, handleAskToJoin, askToEnterLoading } =
		useWaitingLobbySocket(roomId);

	////////////////////////////////////////////////////////////////////////////////////////////////////
	return (
		<div className="flex h-full w-full flex-col p-4 sm:flex-row">
			<div className="relative flex h-full w-full flex-col items-center justify-center sm:p-5 md:w-[50%] md:px-10">
				<div className="relative aspect-video w-full">
					<UserVideoPanel />
					<MediaControls />
					<MediaSettings />
				</div>
			</div>
			<div className="flex h-full w-full items-center justify-center md:w-[50%] md:justify-start md:p-5">
				<Card className="w-full max-w-[400px] border border-dashed">
					{roomDetails ? (
						<>
							<CardHeader>
								<div className="flex items-center justify-between">
									Title{' '}
									<RWebShare
										data={{
											text: `To join the meeting on VEDO Meet, click this link: ${window.location.href} Or open Meet and enter this code: ${roomId}`,
											url: window.location.href,
											title: 'roomUrl',
										}}
										onClick={() => console.log('roomUrl shared successfully!')}
									>
										<Button
											variant="outline"
											size="sm"
											className="ml-auto gap-1.5 text-sm"
										>
											<Share className="size-3.5" />
											Share
										</Button>
									</RWebShare>
								</div>
								<CardTitle>
									{roomDetails ? roomDetails.title : <Spinner />}
								</CardTitle>
								<div>Description</div>
								<CardDescription>
									{roomDetails ? roomDetails?.description : <Spinner />}
								</CardDescription>
							</CardHeader>

							<CardFooter className="item-center flex justify-evenly">
								{canJoin ? (
									<Button onClick={() => handleJoinRoom()}>Join Room</Button>
								) : (
									<Button
										disabled={askToEnterLoading}
										onClick={() => handleAskToJoin()}
									>
										{askToEnterLoading ? <Spinner /> : <>ask to Join</>}
									</Button>
								)}
							</CardFooter>
						</>
					) : (
						<div className="flex w-full items-center justify-center">
							<Spinner />
						</div>
					)}
				</Card>
			</div>
		</div>
	);
};

export default WaitingLobby;
