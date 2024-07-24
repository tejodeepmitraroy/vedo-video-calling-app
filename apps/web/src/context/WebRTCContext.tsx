'use client';

import {
	createContext,
	useContext,
	ReactNode,
	useEffect,
	useCallback,
	useRef,
} from 'react';

interface IWebRTCContext {
	peer: RTCPeerConnection | null;
	getAllMediaDevices: () => Promise<
		| {
				cameras: MediaDeviceInfo[];
				microphones: MediaDeviceInfo[];
		  }
		| undefined
	>;

	getUserMedia: ({
		camera,
		microphone,
	}: {
		camera: string;
		microphone: string;
	}) => Promise<MediaStream | undefined>;

	getRemoteStream: () => MediaStream | undefined;
	getLocalStream: () => MediaStream | undefined;

	createOffer: () => Promise<RTCSessionDescriptionInit | undefined>;
	getAnswer: (
		offer: RTCSessionDescriptionInit
	) => Promise<RTCSessionDescriptionInit | undefined>;

	setRemoteDescription: (answer: RTCSessionDescriptionInit) => void;
	connectionStatus: () => string | undefined;
	disconnectPeer: () => void;
}

const WebRTCContext = createContext<IWebRTCContext | null>(null);

export const useWebRTC = () => {
	const state = useContext(WebRTCContext);
	if (!state) throw new Error('state is undefined');
	return state;
};

export const WebRTCProvider = ({ children }: { children: ReactNode }) => {
	const peer = useRef<RTCPeerConnection | null>(null);
	const localStream = useRef<MediaStream | null>(null);

	const remoteStream = useRef<MediaStream | null>(null);

	useEffect(() => {
		if (!peer.current) {
			const configuration = {
				iceServers: [
					{
						urls: [
							'stun:stun.l.google.com:19302',
							'stun:global.stun.twilio.com:3478',
						],
					},
				],
			};

			peer.current = new RTCPeerConnection(configuration);
		}
		remoteStream.current = new MediaStream();
	}, [peer]);

	useEffect(() => {
		if (peer.current) {
			peer.current.addEventListener('signalingstatechange', (event) => {
				console.log('signaling Event Change!');
				console.log('Event=======>', event);
				console.log(peer.current?.signalingState);
			});

			peer.current.addEventListener('track', async (event) => {
				event.streams[0].getTracks().forEach((track) => {
					console.log('Remote tracks---->', track);
					console.log('Remote Stream---->', remoteStream.current);
					remoteStream.current?.addTrack(track);
				});
			});
		}
	}, [peer, remoteStream]);

	const getAllMediaDevices: IWebRTCContext['getAllMediaDevices'] =
		useCallback(async () => {
			try {
				const devices = await navigator.mediaDevices.enumerateDevices();
				const cameras = devices.filter(
					(device) => device.kind === 'videoinput'
				);
				const microphones = devices.filter(
					(device) => device.kind === 'audioinput'
				);

				return { cameras, microphones };
			} catch (error) {
				console.error('Error opening video camera.', error);
			}
		}, []);

	const getUserMedia: IWebRTCContext['getUserMedia'] = useCallback(
		async ({ camera, microphone }: { camera: string; microphone: string }) => {
			try {
				const constraints = {
					video: camera
						? {
								deviceId: { exact: camera },
								width: { ideal: 1280 },
								height: { ideal: 720 },
								cursor: 'never',
							}
						: {
								width: { ideal: 1280 },
								height: { ideal: 720 },
								cursor: 'never',
							},

					audio: microphone ? { deviceId: { exact: microphone } } : true,
				};
				localStream.current =
					await navigator.mediaDevices.getUserMedia(constraints);

				console.log('Got MediaStream:', localStream.current);

				return localStream.current;
			} catch (error) {
				console.error('Error accessing media devices:', error);
			}
		},
		[]
	);

	const getRemoteStream: IWebRTCContext['getRemoteStream'] = () => {
		if (remoteStream.current) {
			return remoteStream.current;
		}
	};
	const getLocalStream: IWebRTCContext['getLocalStream'] = () => {
		if (localStream.current) {
			return localStream.current;
		}
	};

	const createOffer: IWebRTCContext['createOffer'] = async () => {
		if (localStream.current && peer.current) {
			console.log('Local Stream==================>', localStream.current);

			localStream.current?.getTracks().forEach((track) => {
				console.log('sending tracks---->', track);
				peer.current?.addTrack(track, localStream.current as MediaStream);
			});

			const offer = await peer.current.createOffer();
			await peer.current.setLocalDescription(new RTCSessionDescription(offer));
			return offer;
		}
	};

	const getAnswer: IWebRTCContext['getAnswer'] = async (offer) => {
		if (peer.current) {
			await peer.current.setRemoteDescription(new RTCSessionDescription(offer));
			const answer = await peer.current.createAnswer();
			await peer.current.setLocalDescription(new RTCSessionDescription(answer));
			return answer;
		}
	};

	const setRemoteDescription: IWebRTCContext['setRemoteDescription'] = async (
		answer
	) => {
		if (peer.current) {
			await peer.current.setRemoteDescription(
				new RTCSessionDescription(answer)
			);
		}
	};

	const connectionStatus: IWebRTCContext['connectionStatus'] = () => {
		if (peer.current) {
			console.log(
				'peer Connection State============>',
				peer.current.connectionState
			);
			if (peer.current.connectionState === 'connected') {
				return 'connected';
			} else {
				return 'not connected';
			}
		}
	};

	const disconnectPeer = () => {
		if (peer.current) {
			peer.current.close();
			localStream.current?.getTracks().forEach((track) => track.stop());
			localStream.current = null;
			remoteStream.current = null;
		}
	};

	return (
		<WebRTCContext.Provider
			value={{
				peer: peer.current,
				getAllMediaDevices,
				getUserMedia,
				getLocalStream,
				getRemoteStream,
				createOffer,
				getAnswer,
				setRemoteDescription,
				connectionStatus,
				disconnectPeer,
			}}
		>
			{children}
		</WebRTCContext.Provider>
	);
};
