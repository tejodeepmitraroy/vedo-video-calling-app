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
		speaker: string;
	}) => void;
	disconnectPeer: ({ user }: { user: ServerStoreUser }) => void;
	resetRemotePeers: () => void;
}

const WebRTCContext = createContext<IWebRTCContext | null>(null);

export const useWebRTC = () => {
	const state = useContext(WebRTCContext);
	if (!state) throw new Error('useWebRTC must be used within a WebRTCProvider');
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

	useEffect(() => {
		// Function to fetch and update devices
		// Run on mount
		getAllMediaDevices();

		// Listen for device changes
		navigator.mediaDevices.addEventListener('devicechange', getAllMediaDevices);

		// Cleanup on unmount
		return () => {
			navigator.mediaDevices.removeEventListener(
				'devicechange',
				getAllMediaDevices
			);
		};
	}, [getAllMediaDevices]);

	//////////////////////////////////////////////////////////////////////////

	// Function to update all peer connections with the current stream
	const updatePeerConnections = useCallback(
		(stream: MediaStream) => {
			peerConnections.forEach((connection) => {
				// Remove all existing tracks
				connection.getSenders().forEach((sender) => {
					if (sender.track) {
						connection.removeTrack(sender);
					}
				});

				// Add new tracks
				stream.getTracks().forEach((track) => {
					if (connection.connectionState === 'connected') {
						connection.addTrack(track, stream);
					}
				});
			});
		},
		[peerConnections]
	);

	const getUserMedia: IWebRTCContext['getUserMedia'] = useCallback(
		async ({ camera, microphone }: { camera: string; microphone: string }) => {
			try {
				console.log('getUserMedia called with:', { camera, microphone });

				// Check if the requested devices are the same as current stream devices
				const currentVideoTrack = localStream.current?.getVideoTracks()[0];
				const currentAudioTrack = localStream.current?.getAudioTracks()[0];
				const currentVideoDeviceId =
					currentVideoTrack?.getSettings?.()?.deviceId;
				const currentAudioDeviceId =
					currentAudioTrack?.getSettings?.()?.deviceId;

				console.log('Current stream devices:', {
					currentVideoDeviceId,
					currentAudioDeviceId,
				});
				console.log('Requested devices:', { camera, microphone });

				// If devices haven't changed and we have a valid stream, don't create a new one
				// But be more strict - only allow creation if devices have changed or if tracks are not ready
				if (
					localStream.current &&
					camera === currentVideoDeviceId &&
					microphone === currentAudioDeviceId &&
					currentVideoTrack?.readyState === 'live' &&
					currentAudioTrack?.readyState === 'live'
				) {
					console.log(
						'Devices unchanged and tracks are ready, skipping getUserMedia'
					);
					return;
				}

				console.log(
					'Devices changed, no stream, or tracks not ready - creating new stream'
				);
				console.log('getUserMedia called with:', { camera, microphone });
				const constraints: MediaStreamConstraints = {
					video: {
						...(camera && { deviceId: { exact: camera } }),
						width: { ideal: 1280 },
						height: { ideal: 720 },
					},
					audio: microphone ? { deviceId: { exact: microphone } } : true,
				};

				// Get new media stream with selected devices
				const newStream =
					await navigator.mediaDevices.getUserMedia(constraints);

				console.log('New stream created successfully', newStream);
				// Stop previous tracks if any
				if (localStream.current) {
					localStream.current.getTracks().forEach((track) => track.stop());
				}
				localStream.current = newStream;
				setLocalStream(newStream);

				// Force a re-render by updating the context value
				// This ensures components get the updated stream immediately

				// Debug logging
				console.log(
					'Video tracks:',
					newStream.getVideoTracks().map((track) => ({
						enabled: track.enabled,
						readyState: track.readyState,
						kind: track.kind,
						label: track.label,
						muted: track.muted,
					}))
				);

				console.log(
					'Audio tracks:',
					newStream.getAudioTracks().map((track) => ({
						enabled: track.enabled,
						readyState: track.readyState,
						kind: track.kind,
						label: track.label,
						muted: track.muted,
					}))
				);

				// // Replace tracks in all active peer connections so remote users get the updated media
				// peerConnections.forEach((connection) => {
				// 	newStream.getTracks().forEach((newTrack) => {
				// 		const sender = connection
				// 			.getSenders()
				// 			.find((s) => s.track && s.track.kind === newTrack.kind);
				// 		if (sender) {
				// 			sender.replaceTrack(newTrack);
				// 		} else {
				// 			connection.addTrack(newTrack, newStream);
				// 		}
				// 	});
				// });
				updatePeerConnections(newStream);
			} catch (error) {
				console.error('Error accessing media devices:', error);
				return null;
			}
		},
		[setLocalStream, updatePeerConnections]
	);

	////////////////////////////////////////////////////////////////////////////

	const createPeerConnection = useCallback(
		(userSocketId: string) => {
			console.log('WebRTC: Creating peer connection for user:', userSocketId);
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

			// Add local tracks immediately if stream is available
			if (localStream.current) {
				console.log('WebRTC: Adding local tracks to new peer connection');
				localStream.current.getTracks().forEach((track) => {
					console.log(
						'Adding track to new connection:',
						track.kind,
						track.label
					);
					peerConnection.addTrack(track, localStream.current as MediaStream);
				});
			} else {
				console.log(
					'WebRTC: No local stream available when creating peer connection'
				);
			}

			peerConnection.addEventListener('track', (event) => {
				console.log('getting tracks================+>', event.streams[0]);
				peerStreams.set(userSocketId, event.streams[0]);

				// Update the streams state with all current remote streams
				const usersStream = peerStreams?.values();
				const remoteStreams = Array.from(usersStream);
				console.log(
					'Updating streams state with:',
					remoteStreams.length,
					'streams'
				);
				setStreams(remoteStreams);
			});

			peerConnection.addEventListener('icecandidate', async (event) => {
				if (event.candidate) {
					console.log('Sending ICE candidate to user:', userSocketId);
					socketEmit('event:sendIceCandidate', {
						iceCandidate: event.candidate,
						userSocketId,
					});
				}
			});

			// Add negotiationneeded event listener to automatically create offers
			peerConnection.addEventListener('negotiationneeded', async () => {
				console.log('WebRTC: Negotiation needed for user:', userSocketId);
				try {
					const offer = await peerConnection.createOffer();
					await peerConnection.setLocalDescription(
						new RTCSessionDescription(offer)
					);
					socketEmit('event:sendOffer', { offer, userSocketId });
					console.log(
						'WebRTC: Offer created and sent automatically for user:',
						userSocketId
					);
				} catch (error) {
					console.error('WebRTC: Error in negotiationneeded handler:', error);
				}
			});

			// Add connection state change logging
			peerConnection.addEventListener('connectionstatechange', () => {
				console.log(
					'Peer connection state for',
					userSocketId,
					':',
					peerConnection.connectionState
				);

				// If connection becomes connected and we have a local stream, ensure tracks are added
				if (
					peerConnection.connectionState === 'connected' &&
					localStream.current
				) {
					console.log(
						'WebRTC: Connection established, ensuring local tracks are added'
					);
					let hasTracks = false;
					peerConnection.getSenders().forEach((sender) => {
						if (sender.track) {
							hasTracks = true;
							console.log(
								'Existing sender track:',
								sender.track.kind,
								sender.track.label
							);
						}
					});

					if (!hasTracks) {
						console.log(
							'WebRTC: No tracks found, adding local tracks to connected peer'
						);
						localStream.current.getTracks().forEach((track) => {
							console.log(
								'Adding track to connected peer:',
								track.kind,
								track.label
							);
							peerConnection.addTrack(
								track,
								localStream.current as MediaStream
							);
						});
					}
				}
			});

			peerConnections.set(userSocketId, peerConnection);

			return peerConnection;
		},
		[peerConnections, peerStreams, socketEmit, localStream]
	);

	const handleCreateOffer = useCallback(
		async ({ userSocketId }: { userSocketId: string }) => {
			console.log('WebRTC: Creating offer for user:', userSocketId);
			console.log('Local stream available:', !!localStream.current);

			const peerConnection =
				peerConnections.get(userSocketId) || createPeerConnection(userSocketId);

			// Wait for local stream if not available
			if (!localStream.current) {
				console.log('WebRTC: No local stream available, waiting...');
				// Wait for a short time for the stream to be ready
				let attempts = 0;
				while (!localStream.current && attempts < 50) {
					// Wait up to 5 seconds
					await new Promise((resolve) => setTimeout(resolve, 100));
					attempts++;
				}

				if (!localStream.current) {
					console.error(
						'WebRTC: Local stream still not available after waiting'
					);
					return;
				}
			}

			// Set the local stream for the store
			setLocalStream(localStream.current);
			console.log('localStream.current=============>>', localStream.current);

			// Add local tracks to the peer connection
			localStream.current?.getTracks().forEach((track) => {
				console.log(
					'Adding track to peer connection:',
					track.kind,
					track.label
				);
				peerConnection.addTrack(track, localStream.current as MediaStream);
			});

			try {
				const offer = await peerConnection.createOffer();
				await peerConnection.setLocalDescription(
					new RTCSessionDescription(offer)
				);

				socketEmit('event:sendOffer', { offer, userSocketId });
				console.log('WebRTC: Offer sent to user:', userSocketId);
			} catch (error) {
				console.error('WebRTC: Error creating offer:', error);
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
			console.log('WebRTC: Creating answer for offer from:', socketId);
			console.log('Local stream available:', !!localStream.current);

			const peerConnection =
				peerConnections.get(socketId) || createPeerConnection(socketId);

			try {
				await peerConnection.setRemoteDescription(
					new RTCSessionDescription(offer)
				);
				console.log('WebRTC: Remote description set successfully');

				// Wait for local stream if not available
				if (!localStream.current) {
					console.log(
						'WebRTC: No local stream available for answer, waiting...'
					);
					let attempts = 0;
					while (!localStream.current && attempts < 50) {
						// Wait up to 5 seconds
						await new Promise((resolve) => setTimeout(resolve, 100));
						attempts++;
					}

					if (!localStream.current) {
						console.error(
							'WebRTC: Local stream still not available after waiting for answer'
						);
						return;
					}
				}

				// Set the local stream for the store
				setLocalStream(localStream.current);
				console.log('localStream.current=============>>', localStream.current);

				// Remove existing tracks first to prevent duplicate sender error
				peerConnection.getSenders().forEach((sender) => {
					if (sender.track) {
						peerConnection.removeTrack(sender);
					}
				});

				// Add local tracks to the peer connection
				localStream.current?.getTracks().forEach((track) => {
					console.log(
						'Adding track to peer connection for answer:',
						track.kind,
						track.label
					);
					peerConnection.addTrack(track, localStream.current as MediaStream);
				});

				const answer = await peerConnection.createAnswer();
				await peerConnection.setLocalDescription(
					new RTCSessionDescription(answer)
				);

				socketEmit('event:sendAnswer', { answer, socketId });
				console.log('WebRTC: Answer sent to user:', socketId);
			} catch (error) {
				console.error('WebRTC: Error creating answer:', error);
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
			console.log(
				'WebRTC: Setting remote description (answer) from user:',
				userSocketId
			);
			const peerConnection = peerConnections.get(userSocketId);

			if (peerConnection) {
				try {
					await peerConnection.setRemoteDescription(
						new RTCSessionDescription(answer)
					);
					console.log(
						'WebRTC: Remote description set successfully for user:',
						userSocketId
					);
				} catch (error) {
					console.error('WebRTC: Error setting remote description:', error);
				}
			} else {
				console.log('WebRTC: No peer connection found for user:', userSocketId);
			}
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
