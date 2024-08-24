'use client';
import { create } from 'zustand';

interface WebRTCStore {
	localStream: MediaStream | null;
	localScreenStream: MediaStream | null;
	isCameraOn: boolean;
	isMicrophoneOn: boolean;
	isScreenSharing: boolean;
	setLocalStream: (localStream: MediaStream | null) => void;
	setLocalScreenStream: (localScreenStream: MediaStream | null) => void;
	toggleCamera: () => void;
	toggleMicrophone: () => void;
	toggleScreenShare: () => void;
	// toggleStopStream: () => void;
}

const useStreamStore = create<WebRTCStore>((set, get) => ({
	localStream: null,
	localScreenStream: null,
	isCameraOn: true,
	isMicrophoneOn: true,
	isScreenSharing: false,
	setLocalStream: (localStream) => set({ localStream }),
	setLocalScreenStream: (localScreenStream) => set({ localScreenStream }),
	toggleCamera: () => {
		const { localStream, isCameraOn } = get();
		if (localStream) {
			localStream
				.getVideoTracks()
				.forEach((track) => (track.enabled = !isCameraOn));
		}
		set({ isCameraOn: !isCameraOn });
	},
	toggleMicrophone: () => {
		const { localStream, isMicrophoneOn } = get();
		if (localStream) {
			localStream
				.getAudioTracks()
				.forEach((track) => (track.enabled = !isMicrophoneOn));
		}
		set({ isMicrophoneOn: !isMicrophoneOn });
	},
	toggleScreenShare: async () => {
		const {
			localStream,
			localScreenStream,
			isScreenSharing,
			setLocalScreenStream,
		} = get();

		if (isScreenSharing && localScreenStream) {
			localScreenStream.getTracks().forEach((track) => track.stop());
			setLocalScreenStream(null);
		} else {
			try {
				const screenStream = await navigator.mediaDevices.getDisplayMedia({
					video: true,
					audio: true,
				});

				const mergedStream = new MediaStream();
				localStream!
					.getTracks()
					.forEach((track) => mergedStream.addTrack(track));
				screenStream
					.getTracks()
					.forEach((track) => mergedStream.addTrack(track));
				console.log('Video Stream-------->>', screenStream);
				setLocalScreenStream(screenStream);
			} catch (error) {
				console.error('Error starting screen share:', error);
			}
		}
		set({ isScreenSharing: !isScreenSharing });
	},
	// toggleStopStream: () => {
	// 	const { localStream } = get();
	// 	if (localStream) {
	// 		localStream.getTracks().forEach((track) => track.stop());

	// 		console.log('Get Track Off', localStream);
	// 	}
	// },
}));

export default useStreamStore;
