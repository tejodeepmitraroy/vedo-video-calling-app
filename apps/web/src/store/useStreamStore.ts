'use client';
import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import WebRTCService from '@/services/webRTCService';
import webRTCService from '@/services/webRTCService';

interface MediaDevices {
	cameras: MediaDeviceInfo[];
	microphones: MediaDeviceInfo[];
}

interface WebRTCStore {
	localStream: MediaStream | null;
	localScreenStream: MediaStream | null;
	remoteStream: MediaStream | null;
	// webRTCService: any | null;
	// startConnection: (isHost: boolean, socket: Socket) => void;
	// disconnect: () => void;
	////

	mediaDevices: MediaDevices;
	selectedCamera: string;
	selectedMicrophone: string;
	isCameraOn: boolean;
	isMicrophoneOn: boolean;
	isScreenSharing: boolean;
	peerOffer: RTCSessionDescriptionInit | null;
	remoteSocketId: string | null;
	setLocalStream: (localStream: MediaStream | null) => void;
	setLocalScreenStream: (localScreenStream: MediaStream | null) => void;
	setMediaDevices: (mediaDevices: MediaDevices) => void;
	setSelectedCamera: (devicesId: string) => void;
	setSelectedMicrophone: (devicesId: string) => void;
	setPeerOffer: (peerOffer: RTCSessionDescriptionInit | undefined) => void;
	setRemoteSocketId: (remoteSocketId: string | null) => void;
	toggleCamera: () => void;
	toggleMicrophone: () => void;
	toggleScreenShare: () => void;
	toggleStopStream: () => void;
}

const useStreamStore = create<WebRTCStore>((set, get) => ({
	localStream: null,
	localScreenStream: null,
	remoteStream: null,
	// webRTCService: null,
	// startConnection: async (isHost, socket) => {
	// 	// const webRTCService = new webRTCService((stream) => {
	// 	// 	set({ remoteStream: stream });
	// 	// }, isHost);
	// 	const webRTCService = new webRTCService((stream) => {
	// 		set({ remoteStream: stream });
	// 	}, isHost);

	// 	const localStream = await webRTCService.getUserMedia();
	// 	set({ localStream });

	// 	if (isHost) {
	// 		webRTCService.startConnection(socket);
	// 	} else {
	// 		socket.emit('joinRoom');
	// 	}

	// 	socket.on('signal', async (data) => {
	// 		await webRTCService.handleSignalData(data, socket);
	// 	});

	// 	socket.on('hostReady', () => {
	// 		webRTCService.startConnection(socket);
	// 	});

	// 	set({ webRTCService });
	// },
	// disconnect: () => {
	// 	get().webRTCService?.disconnectPeer();
	// 	set({ localStream: null, remoteStream: null, webRTCService: null });
	// },

	mediaDevices: { cameras: [], microphones: [] },
	selectedCamera: '',
	selectedMicrophone: '',
	isCameraOn: false,
	isMicrophoneOn: false,
	isScreenSharing: false,
	peerOffer: null,
	remoteSocketId: null,
	setLocalStream: (localStream) => set({ localStream }),
	setPeerOffer: (peerOffer) => set({ peerOffer }),
	setRemoteSocketId: (remoteSocketId) => set({ remoteSocketId }),
	setLocalScreenStream: (localScreenStream) => set({ localScreenStream }),
	setMediaDevices: (mediaDevices) => set({ mediaDevices }),
	setSelectedCamera: (deviceId: string) => set({ selectedCamera: deviceId }),
	setSelectedMicrophone: (deviceId: string) =>
		set({ selectedMicrophone: deviceId }),
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
	toggleStopStream: () => {
		const { localStream } = get();
		if (localStream) {
			localStream.getTracks().forEach((track) => track.stop());

			console.log('Get Track Off', localStream);
		}
	},
}));

export default useStreamStore;
