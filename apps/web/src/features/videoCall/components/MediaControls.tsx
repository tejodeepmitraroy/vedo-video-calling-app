'use client';
import { Button } from '@/components/ui/button';
import useStreamStore from '@/store/useStreamStore';
import { Mic, Video, MicOff, VideoOff, Loader2 } from 'lucide-react';
import React, { useState } from 'react';

const MediaControls = () => {
	const isCameraOn = useStreamStore((state) => state.isCameraOn);
	const isMicrophoneOn = useStreamStore((state) => state.isMicrophoneOn);
	const toggleMicrophone = useStreamStore((state) => state.toggleMicrophone);
	const toggleCamera = useStreamStore((state) => state.toggleCamera);
	const localStream = useStreamStore((state) => state.localStream);

	const [isTogglingCamera, setIsTogglingCamera] = useState(false);
	const [isTogglingMicrophone, setIsTogglingMicrophone] = useState(false);

	const handleToggleCamera = async () => {
		if (!localStream) return;

		try {
			setIsTogglingCamera(true);
			await toggleCamera();

			// Force update the video element
			const videoTracks = localStream.getVideoTracks();
			if (videoTracks.length > 0) {
				videoTracks[0].enabled = !isCameraOn;
			}
		} catch (error) {
			console.error('Failed to toggle camera:', error);
		} finally {
			setIsTogglingCamera(false);
		}
	};

	const handleToggleMicrophone = async () => {
		if (!localStream) return;

		try {
			setIsTogglingMicrophone(true);
			await toggleMicrophone();

			// Force update the audio tracks
			const audioTracks = localStream.getAudioTracks();
			if (audioTracks.length > 0) {
				audioTracks[0].enabled = !isMicrophoneOn;
			}
		} catch (error) {
			console.error('Failed to toggle microphone:', error);
		} finally {
			setIsTogglingMicrophone(false);
		}
	};

	return (
		<div className="absolute bottom-0 left-0 right-0 z-20 flex h-20 w-full items-center justify-center bg-transparent">
			<div className="flex gap-4">
				{/* Camera Toggle */}
				<Button
					variant={isCameraOn ? 'default' : 'destructive'}
					onClick={handleToggleCamera}
					disabled={isTogglingCamera || !localStream}
					className="p-5"
					aria-label={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
				>
					{isTogglingCamera ? (
						<Loader2 className="h-6 w-6 animate-spin" />
					) : isCameraOn ? (
						<Video className="h-6 w-6" />
					) : (
						<VideoOff className="h-6 w-6" />
					)}
				</Button>

				{/* Microphone Toggle */}
				<Button
					variant={isMicrophoneOn ? 'default' : 'destructive'}
					onClick={handleToggleMicrophone}
					disabled={isTogglingMicrophone || !localStream}
					className="p-5"
					aria-label={isMicrophoneOn ? 'Mute microphone' : 'Unmute microphone'}
				>
					{isTogglingMicrophone ? (
						<Loader2 className="h-6 w-6 animate-spin" />
					) : isMicrophoneOn ? (
						<Mic className="h-6 w-6" />
					) : (
						<MicOff className="h-6 w-6" />
					)}
				</Button>
			</div>
		</div>
	);
};

export default MediaControls;
