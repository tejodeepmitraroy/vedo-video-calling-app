'use client';

import {
	createContext,
	useContext,
	ReactNode,
	useCallback,
	useRef,
	// useState,
	useMemo,
	useState,
} from 'react';
import { useSocket } from './SocketContext';

type PeerStreams = {
	[userId: string]: MediaStream;
};
interface IWebRTCContext {
	peerStreams: PeerStreams;
	// peerStreams: MediaStream[];
	peerConnections: Map<string, RTCPeerConnection>;
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

	createOffer: ({ userSocketId }: { userSocketId: string }) => void;
	createAnswer: ({
		offer,
		userSocketId,
	}: {
		offer: RTCSessionDescriptionInit;
		userSocketId: string;
	}) => void;

	setRemoteDescription: ({
		answer,
		userSocketId,
	}: {
		answer: RTCSessionDescriptionInit;
		userSocketId: string;
	}) => void;

	addIceCandidate: ({
		iceCandidate,
		socketId,
	}: {
		iceCandidate: any;
		socketId: string;
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
	// const [streams, setStreams] = useState<MediaStream[]>([]);
	const [peerStreams, setPeerStreams] = useState<PeerStreams>({});
	// const [peerStreams, setPeerStreams] = useState<MediaStream[]>([]);
	const peer = useRef<RTCPeerConnection | null>(null);
	const localStream = useRef<MediaStream | null>(null);
	const remoteStream = useRef<MediaStream | null>(null);
	const peerConnections = useMemo(
		() => new Map<string, RTCPeerConnection>(),
		[]
	);
	// const peerStreams = useMemo(() => new Map<string, MediaStream>(), []);

	const { socketEmit } = useSocket();

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

				peerConnection.addEventListener('track', (event) => {
					console.log('getting tracks================+>', event.streams[0]);
					// if (peerStreams.size) {
					// peerStreams.set(userSocketId, event.streams[0]);
					// }

					setPeerStreams((prevStreams) => ({
						...prevStreams,
						[userSocketId]: event.streams[0],
					}));
					// setPeerStreams((prevStreams) => [...prevStreams, event.streams[0]]);
				});

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

				peerConnections.set(userSocketId, peerConnection);

				return peerConnection;
			},
			[peerConnections, socketEmit]
		);

	const createOffer: IWebRTCContext['createOffer'] = useCallback(
		async ({ userSocketId }) => {
			const peerConnection =
				peerConnections.get(userSocketId) || createPeerConnection(userSocketId);
			if (localStream.current) {
				localStream.current?.getTracks().forEach((track) => {
					console.log('Sending tracks================+>', localStream.current);
					peerConnection.addTrack(track, localStream.current as MediaStream);
				});

				const offer = await peerConnection.createOffer();
				await peerConnection.setLocalDescription(
					new RTCSessionDescription(offer)
				);

				socketEmit('event:sendOffer', { offer, userSocketId });
			}
		},
		[createPeerConnection, peerConnections, socketEmit]
	);

	const createAnswer: IWebRTCContext['createAnswer'] = useCallback(
		async ({ offer, userSocketId }) => {
			const peerConnection =
				peerConnections.get(userSocketId) || createPeerConnection(userSocketId);

			await peerConnection.setRemoteDescription(
				new RTCSessionDescription(offer)
			);

			if (localStream.current) {
				console.log('Sending tracks================+>', localStream.current);
				localStream.current
					.getTracks()
					.forEach((track) =>
						peerConnection.addTrack(track, localStream.current as MediaStream)
					);

				const answer = await peerConnection.createAnswer();
				await peerConnection.setLocalDescription(
					new RTCSessionDescription(answer)
				);

				socketEmit('event:sendAnswer', { answer, socketId: userSocketId });
			}
		},
		[createPeerConnection, peerConnections, socketEmit]
	);

	const setRemoteDescription: IWebRTCContext['setRemoteDescription'] =
		useCallback(
			async ({ answer, userSocketId }) => {
				const peerConnection = peerConnections.get(userSocketId);

				await peerConnection?.setRemoteDescription(
					new RTCSessionDescription(answer)
				);
			},
			[peerConnections]
		);

	const addIceCandidate: IWebRTCContext['addIceCandidate'] = useCallback(
		async ({ iceCandidate, socketId }) => {
			const peerConnection = peerConnections.get(socketId);
			if (iceCandidate) {
				try {
					console.log(
						'=========================Get Ice Candidate=================='
						// iceCandidate
					);

					await peerConnection?.addIceCandidate(iceCandidate);
				} catch (error) {
					console.error('Error adding received ice candidate', error);
				}
			}
		},
		[peerConnections]
	);

	///////////////////////////////////////////////////////////////////////////////

	const getRemoteStream: IWebRTCContext['getRemoteStream'] = useCallback(() => {
		if (remoteStream.current) {
			return remoteStream.current;
		}
	}, []);
	const getLocalStream: IWebRTCContext['getLocalStream'] = useCallback(() => {
		if (localStream.current) {
			return localStream.current;
		}
	}, []);

	const connectionStatus: IWebRTCContext['connectionStatus'] =
		useCallback(() => {
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
		}, []);

	const disconnectPeer = useCallback(() => {
		if (peer.current) {
			peer.current.close();
			localStream.current?.getTracks().forEach((track) => track.stop());
			peer.current = null;
			localStream.current = null;
		}
	}, []);

	const resetRemotePeer = useCallback(() => {
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
	}, []);

	// useEffect(() => {
	// 	const AllUsers = peerStreams.values();
	// 	const participantsArray = Array.from(AllUsers);
	// 	setStreams(participantsArray);
	// }, [peerStreams]);

	return (
		<WebRTCContext.Provider
			value={{
				peerStreams: peerStreams,
				peerConnections,
				createPeerConnection,
				getAllMediaDevices,
				getUserMedia,
				getLocalStream,
				getRemoteStream,
				createOffer,
				createAnswer,
				setRemoteDescription,
				addIceCandidate,
				connectionStatus,
				disconnectPeer,
				resetRemotePeer,
			}}
		>
			{children}
		</WebRTCContext.Provider>
	);
};
