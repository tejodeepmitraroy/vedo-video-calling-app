'use client';

import {
	createContext,
	useContext,
	ReactNode,
	useCallback,
	useRef,
	useState,
} from 'react';
import { useSocket } from './SocketContext';

interface IWebRTCContext {
	peerStreams: any;
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
	}) => Promise<MediaStream | null>;

	getRemoteStream: () => MediaStream | undefined;
	getLocalStream: () => MediaStream | undefined;

	createOffer: (
		peerConnection: RTCPeerConnection
	) => Promise<RTCSessionDescriptionInit | undefined>;
	createAnswer: ({
		peerConnection,
		offer,
	}: {
		peerConnection: RTCPeerConnection;
		offer: RTCSessionDescriptionInit;
	}) => Promise<RTCSessionDescriptionInit | undefined>;

	setRemoteDescription: ({
		peerConnection,
		answer,
	}: {
		peerConnection: RTCPeerConnection;
		answer: RTCSessionDescriptionInit;
	}) => void;
	connectionStatus: () => string | undefined;
	disconnectPeer: () => void;
	resetRemotePeer: () => void;
	createPeerConnection: (userId: string) => RTCPeerConnection;
}

const WebRTCContext = createContext<IWebRTCContext | null>(null);

export const useWebRTC2 = () => {
	const state = useContext(WebRTCContext);
	if (!state) throw new Error('state is undefined');
	return state;
};

export const WebRTCProvider2 = ({ children }: { children: ReactNode }) => {
	// const [peers, setPeers] = useState<MediaStream[]>([]);
	const [peerStreams, setPeerStreams] = useState({});

	const peer = useRef<RTCPeerConnection | null>(null);
	const localStream = useRef<MediaStream | null>(null);

	const remoteStream = useRef<MediaStream | null>(null);

	const { socketEmit } = useSocket();

	// useEffect(() => {
	// 	if (!peer.current) {
	// 		const configuration = {
	// 			iceServers: [
	// 				{
	// 					urls: [
	// 						'stun:stun.l.google.com:19302',
	// 						'stun:global.stun.twilio.com:3478',
	// 					],
	// 				},
	// 			],
	// 		};

	// 		peer.current = new RTCPeerConnection(configuration);
	// 	}
	// 	remoteStream.current = new MediaStream();
	// }, [peer]);

	// useEffect(() => {
	// 	if (peer.current) {
	// 		peer.current.addEventListener('signalingstatechange', (event) => {
	// 			console.log('signaling Event Change!');
	// 			console.log('Event=======>', event);
	// 			console.log(peer.current?.signalingState);
	// 		});

	// 		peer.current.addEventListener('track', async (event) => {
	// 			event.streams[0].getTracks().forEach((track) => {
	// 				console.log('Remote tracks---->', track);
	// 				console.log('Remote Stream---->', remoteStream.current);
	// 				remoteStream.current?.addTrack(track);
	// 			});
	// 		});
	// 	}
	// }, [peer, remoteStream]);

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

				// console.log('Got MediaStream:', localStream.current);

				return localStream.current;
			} catch (error) {
				console.error('Error accessing media devices:', error);
				return null;
			}
		},
		[]
	);
	////////////////////////////////////////////////////////////////////////////
	const createPeerConnection: IWebRTCContext['createPeerConnection'] =
		useCallback(
			(userSocketId: string) => {
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
				const peerConnection = new RTCPeerConnection(configuration);

				peerConnection.addEventListener('icecandidate', async (event) => {
					if (event.candidate) {
						console.log(
							'=========================SEND Ice Candidate=================='
						);
						socketEmit('event:sendIceCandidate', {
							iceCandidate: event.candidate,
							userSocketId,
						});
					}
				});

				peerConnection.addEventListener('track', (event) => {
					console.log('event.streams[0]==========>', event.streams[0]);

					// setPeers([...peers,peerConnections.  [userId]: event.streams[0]]);
					setPeerStreams((prevStreams) => ({
						...prevStreams,
						[userSocketId]: event.streams[0],
					}));
					console.log('peers Stream==========>', peerStreams);
				});

				return peerConnection;
			},
			[peerStreams, socketEmit]
		);

	const createOffer: IWebRTCContext['createOffer'] = async (peerConnection) => {
		if (localStream.current) {
			// console.log('Local Stream==================>', localStream.current);

			localStream.current?.getTracks().forEach((track) => {
				// console.log('sending Local Stream tracks---->', track);
				peerConnection.addTrack(track, localStream.current as MediaStream);
			});

			const offer = await peerConnection.createOffer();
			await peerConnection.setLocalDescription(
				new RTCSessionDescription(offer)
			);
			return offer;
		}
	};

	const createAnswer: IWebRTCContext['createAnswer'] = async ({
		peerConnection,
		offer,
	}) => {
		await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
		const answer = await peerConnection.createAnswer();
		await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
		return answer;
	};

	const setRemoteDescription: IWebRTCContext['setRemoteDescription'] = async ({
		peerConnection,
		answer,
	}) => {
		await peerConnection.setRemoteDescription(
			new RTCSessionDescription(answer)
		);
	};

	///////////////////////////////////////////////////////////////////////////////

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
			peer.current = null;
			localStream.current = null;
		}
	};

	const resetRemotePeer = () => {
		if (peer.current) {
			peer.current.close();
			localStream.current?.getTracks().forEach((track) => track.stop());
			// remoteStream.current = null;

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
	};

	return (
		<WebRTCContext.Provider
			value={{
				peerStreams: peerStreams,
				createPeerConnection,
				getAllMediaDevices,
				getUserMedia,
				getLocalStream,
				getRemoteStream,
				createOffer,
				createAnswer,
				setRemoteDescription,
				connectionStatus,
				disconnectPeer,
				resetRemotePeer,
			}}
		>
			{children}
		</WebRTCContext.Provider>
	);
};
