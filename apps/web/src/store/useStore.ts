'use client';
import { create } from 'zustand';

interface SelectedDevices {
	camera: string;
	microphone: string;
}

interface WebRTCStore {
	stream: MediaStream | null;
	screenStream: MediaStream | null;
	selectedDevices: SelectedDevices;
	isCameraOn: boolean;
	isMicrophoneOn: boolean;
	isScreenSharing: boolean;
	setStream: (stream: MediaStream | null) => void;
	setScreenStream: (stream: MediaStream | null) => void;
	setSelectedDevices: (devices: SelectedDevices) => void;
	toggleCamera: () => void;
	toggleMicrophone: () => void;
	toggleScreenShare: () => void;
}

export const useRoomStore = create<WebRTCStore>((set, get) => ({
	stream: null,
	screenStream: null,
	selectedDevices: { camera: '', microphone: '' },
	isCameraOn: false,
	isMicrophoneOn: false,
	isScreenSharing: false,
	setStream: (stream) => set({ stream }),
	setScreenStream: (screenStream) => set({ screenStream }),
	setSelectedDevices: (selectedDevices) => set({ selectedDevices }),
	toggleCamera: () => {
		const { stream, isCameraOn } = get();
		if (stream) {
			stream.getVideoTracks().forEach((track) => (track.enabled = !isCameraOn));
		}
		set({ isCameraOn: !isCameraOn });
	},
	toggleMicrophone: () => {
		const { stream, isMicrophoneOn } = get();
		if (stream) {
			stream
				.getAudioTracks()
				.forEach((track) => (track.enabled = !isMicrophoneOn));
		}
		set({ isMicrophoneOn: !isMicrophoneOn });
	},
	toggleScreenShare: async () => {
		const { screenStream, isScreenSharing, setScreenStream } = get();

		if (isScreenSharing && screenStream) {
			screenStream.getTracks().forEach((track) => track.stop());
			setScreenStream(null);
		} else {
			try {
				const screenStream = await navigator.mediaDevices.getDisplayMedia({
					video: true,
					audio: true,
				});

				setScreenStream(screenStream);
			} catch (error) {
				console.error('Error starting screen share:', error);
			}
		}
		set({ isScreenSharing: !isScreenSharing });
	},
}));
