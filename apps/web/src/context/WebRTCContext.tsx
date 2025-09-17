'use client';

import {
	createContext,
	useContext,
	ReactNode,
	useCallback,
	useRef,
	useMemo,
	useState,
	useEffect,
} from 'react';
import { useSocket } from './SocketContext';
import useStreamStore from '@/store/useStreamStore';
import useDeviceStore from '@/store/useDeviceStore';
// import useParticipantsStore from '@/store/useParticipantsStore';

// interface Participant {
// 	socketId: string;
// 	userId: string;
// 	fullName: string;
// 	imageUrl: string;
// 	emailAddress: string;
// 	host: boolean;
// 	stream: MediaStream;
// }
interface IWebRTCContext {
	localStream: MediaStream | null;
	streams: MediaStream[];
	// participantStreams: Participant[];
	getAllMediaDevices: () => void;
	getUserMedia: ({
		camera,
		microphone,
	}: {
		camera: string;
		microphone: string;
	}) => void;
	disconnectPeer: ({ user }: { user: ServerStoreUser }) => void;
	resetRemotePeers: () => void;
}

const WebRTCContext = createContext<IWebRTCContext | null>(null);

export const useWebRTC = () => {
	const state = useContext(WebRTCContext);
	if (!state) throw new Error('state is undefined');
	return state;
};

export const WebRTCProvider = ({ children }: { children: ReactNode }) => {
	const [streams, setStreams] = useState<MediaStream[]>([]);
	// const [participantStreams, setParticipantStreams] = useState<Participant[]>(
	// 	[]
	// );
	const localStream = useRef<MediaStream | null>(null);
	const peerStreams = useMemo(() => new Map<string, MediaStream>(), []);
	const peerConnections = useMemo(
		() => new Map<string, RTCPeerConnection>(),
		[]
	);

	// const participants = useParticipantsStore((state) => state.participants);
	const { socketEmit, socketOn, socketOff } = useSocket();

	const setLocalStream = useStreamStore((state) => state.setLocalStream);
	const setMediaDevices = useDeviceStore((state) => state.setMediaDevices);
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
				const speakers = devices.filter(
					(device) => device.kind === 'audiooutput'
				);

				setMediaDevices({ cameras, microphones, speakers });
			} catch (error) {
				console.error('Error opening video camera.', error);
			}
		}, [setMediaDevices]);

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

				setLocalStream(localStream.current);
			} catch (error) {
				console.error('Error accessing media devices:', error);
				return null;
			}
		},
		[setLocalStream]
	);

	////////////////////////////////////////////////////////////////////////////

	const createPeerConnection = useCallback(
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
				peerStreams.set(userSocketId, event.streams[0]);
				const usersStream = peerStreams?.values();
				// const usersSocket = peerStreams?.keys();
				const remoteStreams = Array.from(usersStream);
				// const remoteSocketIds = Array.from(usersSocket);

				// const updatedStream = remoteSocketIds.map((socketId) => {

				// 	return {
				// 		socketId: participant.socketId,
				// 		userId: participant.userId,
				// 		fullName: participant.fullName,
				// 		imageUrl: participant.imageUrl,
				// 		emailAddress: participant.emailAddress,
				// 		host: participant.host,
				// 		stream: peerStreams.get(participant.socketId)!,
				// 	};
				// } );

				// const newStreams = participants.map((participant) => {
				// 	if (peerStreams.get(participant.socketId)) {
				// 		return {
				// 			socketId: participant.socketId,
				// 			userId: participant.userId,
				// 			fullName: participant.fullName,
				// 			imageUrl: participant.imageUrl,
				// 			emailAddress: participant.emailAddress,
				// 			host: participant.host,
				// 			stream: peerStreams.get(participant.socketId)!,
				// 		};
				// 	} else {
				// 		return {
				// 			socketId: participant.socketId,
				// 			userId: participant.userId,
				// 			fullName: participant.fullName,
				// 			imageUrl: participant.imageUrl,
				// 			emailAddress: participant.emailAddress,
				// 			host: participant.host,
				// 			stream: localStream.current!,
				// 		};
				// 	}
				// });

				// setParticipantStreams(newStreams);
				setStreams(remoteStreams);
			});

			peerConnection.addEventListener('icecandidate', async (event) => {
				if (event.candidate) {
					// console.log(
					// 	'=========================SEND Ice Candidate=================='
					// );
					socketEmit('event:sendIceCandidate', {
						iceCandidate: event.candidate,
						userSocketId,
					});
				}
			});

			peerConnections.set(userSocketId, peerConnection);

			return peerConnection;
		},
		[peerConnections, peerStreams, socketEmit]
	);

	const handleCreateOffer = useCallback(
		async ({ userSocketId }: { userSocketId: string }) => {
			const peerConnection =
				peerConnections.get(userSocketId) || createPeerConnection(userSocketId);
			if (localStream.current) {
				setLocalStream(localStream.current);
				console.log('localStream.current=============>>', localStream.current);
				localStream.current?.getTracks().forEach((track) => {
					peerConnection.addTrack(track, localStream.current as MediaStream);
				});

				const offer = await peerConnection.createOffer();
				await peerConnection.setLocalDescription(
					new RTCSessionDescription(offer)
				);

				socketEmit('event:sendOffer', { offer, userSocketId });
			}
		},
		[createPeerConnection, peerConnections, setLocalStream, socketEmit]
	);

	const handleCreateAnswer = useCallback(
		async ({
			offer,
			socketId,
		}: {
			offer: RTCSessionDescriptionInit;
			socketId: string;
		}) => {
			const peerConnection =
				peerConnections.get(socketId) || createPeerConnection(socketId);

			await peerConnection.setRemoteDescription(
				new RTCSessionDescription(offer)
			);

			if (localStream.current) {
				console.log('localStream.current=============>>', localStream.current);
				setLocalStream(localStream.current);
				localStream.current
					.getTracks()
					.forEach((track) =>
						peerConnection.addTrack(track, localStream.current as MediaStream)
					);

				const answer = await peerConnection.createAnswer();
				await peerConnection.setLocalDescription(
					new RTCSessionDescription(answer)
				);

				socketEmit('event:sendAnswer', { answer, socketId });
			}
		},
		[createPeerConnection, peerConnections, setLocalStream, socketEmit]
	);

	const setRemoteDescription = useCallback(
		async ({
			answer,
			userSocketId,
		}: {
			answer: RTCSessionDescriptionInit;
			userSocketId: string;
		}) => {
			const peerConnection = peerConnections.get(userSocketId);

			await peerConnection?.setRemoteDescription(
				new RTCSessionDescription(answer)
			);
		},
		[peerConnections]
	);

	const handleAddIceCandidate = useCallback(
		async ({
			iceCandidate,
			socketId,
		}: {
			iceCandidate: any;
			socketId: string;
		}) => {
			const peerConnection = peerConnections.get(socketId);
			if (iceCandidate) {
				try {
					// console.log(
					// 	'=========================Get Ice Candidate=================='
					// );

					await peerConnection?.addIceCandidate(iceCandidate);
				} catch (error) {
					console.error('Error adding received ice candidate', error);
				}
			}
		},
		[peerConnections]
	);

	///////////////////////////////////////////////////////////////////////////////

	const disconnectPeer: IWebRTCContext['disconnectPeer'] = useCallback(
		({ user }) => {
			const socketId = user.socketId;
			const peerConnection = peerConnections.get(socketId);
			peerConnection?.close();
			peerStreams.delete(socketId);
			const AllUsers = peerStreams?.values();
			const remoteStreams = Array.from(AllUsers);
			setStreams(remoteStreams);
			peerConnections.delete(user.socketId);
		},
		[peerConnections, peerStreams]
	);

	const resetRemotePeers: IWebRTCContext['resetRemotePeers'] =
		useCallback(() => {
			if (localStream.current) {
				console.log('Reseting Peer======================>');
				peerConnections.forEach((value) => {
					value.close();
				});
				localStream.current.getTracks().forEach((track) => track.stop());
				setLocalStream(null);
			}
		}, [peerConnections, setLocalStream]);

	///////////////////////////////////////////////////////////////////////////////////////////

	useEffect(() => {
		socketOn('event:user-connected', handleCreateOffer);
		socketOn('event:getOffer', handleCreateAnswer);
		socketOn('event:getAnswer', setRemoteDescription);
		socketOn('event:addIceCandidate', handleAddIceCandidate);

		return () => {
			socketOff('event:user-connected', handleCreateOffer);
			socketOff('event:getOffer', handleCreateAnswer);
			socketOff('event:getAnswer', setRemoteDescription);
			socketOff('event:addIceCandidate', handleAddIceCandidate);
		};
	}, [
		handleAddIceCandidate,
		handleCreateAnswer,
		handleCreateOffer,
		setRemoteDescription,
		socketOff,
		socketOn,
	]);

	return (
		<WebRTCContext.Provider
			value={{
				localStream: localStream.current,
				streams,
				// participantStreams,
				getAllMediaDevices,
				getUserMedia,
				disconnectPeer,
				resetRemotePeers,
			}}
		>
			{children}
		</WebRTCContext.Provider>
	);
};
