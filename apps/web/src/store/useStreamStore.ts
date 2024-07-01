'use client';
import { Socket } from 'socket.io-client';
import { create } from 'zustand';

interface SelectedDevices {
	camera: string;
	microphone: string;
}

interface WebRTCStore {
	remoteSocketId: string | null;
	stream: MediaStream | null;
	screenStream: MediaStream | null;
	selectedDevices: SelectedDevices;
	selectedCamera: string;
	selectedMicrophone: string;
	isCameraOn: boolean;
	isMicrophoneOn: boolean;
	isScreenSharing: boolean;
	setRemoteSocketId: (remoteSocketId: string) => void;
	setStream: (stream: MediaStream | null) => void;
	setScreenStream: (stream: MediaStream | null) => void;
	setSelectedDevices: (devices: SelectedDevices) => void;
	setSelectedCamera: (devicesId: string) => void;
	setSelectedMicrophone: (devicesId: string) => void;
	toggleCamera: () => void;
	toggleMicrophone: () => void;
	toggleScreenShare: () => void;
}

export const useRoomStore = create<WebRTCStore>((set, get) => ({
	remoteSocketId: null,
	stream: null,
	screenStream: null,
	selectedDevices: { camera: '', microphone: '' },
	selectedCamera: '',
	selectedMicrophone: '',
	isCameraOn: false,
	isMicrophoneOn: false,
	isScreenSharing: false,
	setRemoteSocketId: (remoteSocketId) => set({ remoteSocketId }),
	setStream: (stream) => set({ stream }),
	setScreenStream: (screenStream) => set({ screenStream }),
	setSelectedDevices: (selectedDevices) => set({ selectedDevices }),
	setSelectedCamera: (deviceId: string) => set({ selectedCamera: deviceId }),
	setSelectedMicrophone: (deviceId: string) =>
		set({ selectedMicrophone: deviceId }),
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
