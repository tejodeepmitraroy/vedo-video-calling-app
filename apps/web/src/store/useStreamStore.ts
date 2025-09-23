'use client';
import { create } from 'zustand';

import { devtools } from 'zustand/middleware';

interface WebRTCStore {
	localStream: MediaStream | null;
	localScreenStream: MediaStream | null;
	isCameraOn: boolean;
	isMicrophoneOn: boolean;
	isScreenSharing: boolean;
	setLocalStream: (stream: MediaStream | null) => void;
	setLocalScreenStream: (stream: MediaStream | null) => void;
	toggleCamera: () => Promise<void>;
	toggleMicrophone: () => Promise<void>;
	toggleScreenShare: () => Promise<void>;
	stopAllTracks: () => void;
}

const useStreamStore = create<WebRTCStore>()(
	devtools((set, get) => ({
		localStream: null,
		localScreenStream: null,
		isCameraOn: true,
		isMicrophoneOn: true,
		isScreenSharing: false,

		setLocalStream: (stream) => {
			// Stop any existing tracks when setting a new stream
			const currentStream = get().localStream;
			if (currentStream) {
				currentStream.getTracks().forEach((track) => track.stop());
			}
			set({ localStream: stream });
		},

		setLocalScreenStream: (stream) => {
			const currentScreenStream = get().localScreenStream;
			if (currentScreenStream) {
				currentScreenStream.getTracks().forEach((track) => track.stop());
			}
			set({ localScreenStream: stream });
		},

		toggleCamera: async () => {
			const { localStream, isCameraOn } = get();
			if (!localStream) return;

			const videoTracks = localStream.getVideoTracks();
			if (videoTracks.length > 0) {
				const newState = !isCameraOn;
				videoTracks[0].enabled = newState;
				set({ isCameraOn: newState });
			}
		},

		toggleMicrophone: async () => {
			const { localStream, isMicrophoneOn } = get();
			if (!localStream) return;

			const audioTracks = localStream.getAudioTracks();
			if (audioTracks.length > 0) {
				const newState = !isMicrophoneOn;
				audioTracks[0].enabled = newState;
				set({ isMicrophoneOn: newState });
			}
		},

		toggleScreenShare: async () => {
			const { isScreenSharing } = get();

			if (isScreenSharing) {
				const { localScreenStream } = get();
				if (localScreenStream) {
					localScreenStream.getTracks().forEach((track) => track.stop());
				}
				set({ localScreenStream: null, isScreenSharing: false });
				return;
			}

			try {
				const screenStream = await navigator.mediaDevices.getDisplayMedia({
					video: true,
					audio: true,
				});

				// Handle when user stops sharing from the browser UI
				screenStream.getVideoTracks()[0].onended = () => {
					get().toggleScreenShare();
				};

				set({ localScreenStream: screenStream, isScreenSharing: true });
			} catch (error) {
				console.error('Error starting screen share:', error);
				set({ isScreenSharing: false });
			}
		},

		stopAllTracks: () => {
			const { localStream, localScreenStream } = get();
			if (localStream) {
				localStream.getTracks().forEach((track) => track.stop());
			}
			if (localScreenStream) {
				localScreenStream.getTracks().forEach((track) => track.stop());
			}
			set({
				localStream: null,
				localScreenStream: null,
				isCameraOn: false,
				isMicrophoneOn: false,
				isScreenSharing: false,
			});
		},
	}))
);

export default useStreamStore;
