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

interface IWebRTCContext {
	localStream: MediaStream | null;
	streams: MediaStream[];
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
	const localStream = useRef<MediaStream | null>(null);
	const peerStreams = useMemo(() => new Map<string, MediaStream>(), []);
	const peerConnections = useMemo(
		() => new Map<string, RTCPeerConnection>(),
		[]
	);

	// ICE queue for candidates that arrive before PC exists / remote desc set
	const iceCandidateQueues = useMemo(
		() => new Map<string, RTCIceCandidateInit[]>(),
		[]
	);

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
		getAllMediaDevices();
		navigator.mediaDevices.addEventListener('devicechange', getAllMediaDevices);
		return () => {
			navigator.mediaDevices.removeEventListener(
				'devicechange',
				getAllMediaDevices
			);
		};
	}, [getAllMediaDevices]);

	// Add or replace tracks on a peer connection cleanly
	// const addOrReplaceTracks = useCallback(
	// 	(connection: RTCPeerConnection, stream: MediaStream) => {
	// 		// For each outgoing track kind (audio/video), try to replace existing sender track,
	// 		// otherwise add a new track.
	// 		stream.getTracks().forEach((newTrack) => {
	// 			const sender = connection
	// 				.getSenders()
	// 				.find((s) => s.track && s.track.kind === newTrack.kind);
	// 			if (sender) {
	// 				// try {
	// 				// replaceTrack returns a Promise in some implementations
	// 				sender.replaceTrack(newTrack);
	// 				console.log('Replaced existing sender track of kind', newTrack.kind);
	// 				// } catch (err) {
	// 				// 	// Some browsers might not support replaceTrack on all senders; fallback to addTrack
	// 				// 	console.warn('replaceTrack failed, falling back to addTrack', err);
	// 				// 	connection.addTrack(newTrack, stream);
	// 				// }
	// 			} else {
	// 				connection.addTrack(newTrack, stream);
	// 				console.log('Added track to connection:', newTrack.kind);
	// 			}
	// 		});
	// 	},
	// 	[]
	// );

	// new code
	const addOrReplaceTracks = useCallback(
		async (connection: RTCPeerConnection, stream: MediaStream) => {
			for (const newTrack of stream.getTracks()) {
				const sender = connection
					.getSenders()
					.find((s) => s.track && s.track.kind === newTrack.kind);
				if (sender) {
					try {
						// Some implementations return Promise; await if they do.
						const maybePromise = sender.replaceTrack(
							newTrack as MediaStreamTrack | null
						);
						if (
							maybePromise &&
							typeof (maybePromise as any).then === 'function'
						) {
							await (maybePromise as Promise<void>);
						}
						console.log(
							'Replaced existing sender track of kind',
							newTrack.kind
						);
					} catch (err) {
						console.warn('replaceTrack failed, falling back to addTrack', err);
						connection.addTrack(newTrack, stream);
					}
				} else {
					connection.addTrack(newTrack, stream);
					console.log('Added track to connection:', newTrack.kind);
				}
			}
		},
		[]
	);

	// Update all existing peer connections with a new stream (use replaceTrack when possible)
	const updatePeerConnections = useCallback(
		(stream: MediaStream) => {
			peerConnections.forEach(async (connection, id) => {
				try {
					addOrReplaceTracks(connection, stream);
				} catch (err) {
					console.error('updatePeerConnections error for', id, err);
				}
			});
		},
		[peerConnections, addOrReplaceTracks]
	);

	const getUserMedia: IWebRTCContext['getUserMedia'] = useCallback(
		async ({ camera, microphone }: { camera: string; microphone: string }) => {
			try {
				console.log('getUserMedia called with:', { camera, microphone });

				const currentVideoTrack = localStream.current?.getVideoTracks()[0];
				const currentAudioTrack = localStream.current?.getAudioTracks()[0];
				const currentVideoDeviceId =
					currentVideoTrack?.getSettings?.()?.deviceId;
				const currentAudioDeviceId =
					currentAudioTrack?.getSettings?.()?.deviceId;

				// If devices unchanged and tracks live, skip
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

				const constraints: MediaStreamConstraints = {
					video: {
						...(camera && { deviceId: { exact: camera } }),
						width: { ideal: 1280 },
						height: { ideal: 720 },
					},
					audio: microphone ? { deviceId: { exact: microphone } } : true,
				};

				const newStream =
					await navigator.mediaDevices.getUserMedia(constraints);
				console.log('New stream created successfully', newStream);

				// Stop old tracks safely
				// if (localStream.current) {
				// 	localStream.current.getTracks().forEach((t) => t.stop());
				// }

				localStream.current = newStream;
				setLocalStream(newStream);

				console.log(
					'Video tracks:',
					newStream.getVideoTracks().map((t) => ({
						enabled: t.enabled,
						readyState: t.readyState,
						kind: t.kind,
						label: t.label,
					}))
				);
				console.log(
					'Audio tracks:',
					newStream.getAudioTracks().map((t) => ({
						enabled: t.enabled,
						readyState: t.readyState,
						kind: t.kind,
						label: t.label,
					}))
				);

				// Replace tracks on all existing peer connections (no destructive removeTrack)
				updatePeerConnections(newStream);

				// Force renegotiation so all peers get the updated tracks
				peerConnections.forEach(async (pc, id) => {
					try {
						const offer = await pc.createOffer();
						await pc.setLocalDescription(offer);
						socketEmit('event:sendOffer', { offer, userSocketId: id });
					} catch (err) {
						console.error('Error sending renegotiation offer to', id, err);
					}
				});
			} catch (error) {
				console.error('Error accessing media devices:', error);
				return null;
			}
		},
		[peerConnections, setLocalStream, socketEmit, updatePeerConnections]
	);

	// Create RTCPeerConnection and wire events. Important: DO NOT remove tracks here.
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
			const pc = new RTCPeerConnection(configuration);

			// If we already have a local stream, add or replace tracks for this new connection
			if (localStream.current) {
				addOrReplaceTracks(pc, localStream.current);
			}

			pc.addEventListener('track', (event) => {
				// event.streams[0] contains the remote stream for this incoming track
				const remote = event.streams[0];
				if (remote) {
					peerStreams.set(userSocketId, remote);
					setStreams(Array.from(peerStreams.values()));
				}
			});

			pc.addEventListener('icecandidate', (event) => {
				if (event.candidate) {
					socketEmit('event:sendIceCandidate', {
						iceCandidate: event.candidate,
						userSocketId,
					});
				}
			});

			// When negotiation is needed (e.g. new local track added), create and send an offer
			pc.addEventListener('negotiationneeded', async () => {
				console.log('negotiationneeded for', userSocketId);
				try {
					const offer = await pc.createOffer();
					await pc.setLocalDescription(offer);
					socketEmit('event:sendOffer', { offer, userSocketId });
				} catch (err) {
					console.error('negotiationneeded error:', err);
				}
			});

			// Debug logging
			pc.addEventListener('connectionstatechange', () => {
				console.log('Connection state for', userSocketId, pc.connectionState);
			});

			peerConnections.set(userSocketId, pc);

			// If there were queued ICE candidates for this peer, flush them now
			const queued = iceCandidateQueues.get(userSocketId);
			if (queued && queued.length > 0) {
				queued.forEach((c) => {
					try {
						pc.addIceCandidate(c).catch((e) =>
							console.warn('addIceCandidate queued failed', e)
						);
					} catch (e) {
						console.warn('error adding queued candidate', e);
					}
				});
				iceCandidateQueues.delete(userSocketId);
			}

			return pc;
		},
		[
			peerConnections,
			peerStreams,
			socketEmit,
			addOrReplaceTracks,
			iceCandidateQueues,
		]
	);

	const handleCreateOffer = useCallback(
		async ({ userSocketId }: { userSocketId: string }) => {
			console.log('Creating offer for', userSocketId);
			const pc =
				peerConnections.get(userSocketId) || createPeerConnection(userSocketId);

			// Ensure we have local stream (wait briefly if needed)
			if (!localStream.current) {
				let attempts = 0;
				while (!localStream.current && attempts < 50) {
					await new Promise((r) => setTimeout(r, 100));
					attempts++;
				}
				if (!localStream.current) {
					console.error('No local stream when creating offer');
					return;
				}
			}

			// Ensure senders are wired to current tracks
			addOrReplaceTracks(pc, localStream.current!);

			try {
				const offer = await pc.createOffer();
				await pc.setLocalDescription(offer);
				socketEmit('event:sendOffer', { offer, userSocketId });
				console.log('Offer sent to', userSocketId);
			} catch (err) {
				console.error('createOffer error', err);
			}
		},
		[createPeerConnection, peerConnections, addOrReplaceTracks, socketEmit]
	);

	const handleCreateAnswer = useCallback(
		async ({
			offer,
			socketId,
		}: {
			offer: RTCSessionDescriptionInit;
			socketId: string;
		}) => {
			console.log('Creating answer for offer from', socketId);
			const pc =
				peerConnections.get(socketId) || createPeerConnection(socketId);

			try {
				// Set remote description (the incoming offer)
				await pc.setRemoteDescription(new RTCSessionDescription(offer));
				console.log('Remote description set');

				// Ensure local stream is available and wired before creating answer
				if (!localStream.current) {
					let attempts = 0;
					while (!localStream.current && attempts < 50) {
						await new Promise((r) => setTimeout(r, 100));
						attempts++;
					}
					if (!localStream.current) {
						console.error('No local stream for creating answer');
						return;
					}
				}

				// Instead of removing all senders, replace or add tracks so the answer includes media
				addOrReplaceTracks(pc, localStream.current!);

				const answer = await pc.createAnswer();
				await pc.setLocalDescription(answer);

				socketEmit('event:sendAnswer', { answer, socketId });
				console.log('Answer sent to', socketId);
			} catch (err) {
				console.error('handleCreateAnswer error', err);
			}
		},
		[peerConnections, createPeerConnection, addOrReplaceTracks, socketEmit]
	);

	const flushIceQueue = useCallback(
		(socketId: string) => {
			const pc = peerConnections.get(socketId);
			if (!pc) return;
			const queued = iceCandidateQueues.get(socketId) || [];
			if (!queued.length) return;
			queued.forEach((c) => {
				pc.addIceCandidate(c).catch((e) =>
					console.warn('addIceCandidate (queued) failed', e)
				);
			});
			iceCandidateQueues.delete(socketId);
		},
		[iceCandidateQueues, peerConnections]
	);

	const setRemoteDescription = useCallback(
		async ({
			answer,
			userSocketId,
		}: {
			answer: RTCSessionDescriptionInit;
			userSocketId: string;
		}) => {
			const pc = peerConnections.get(userSocketId);
			if (!pc) {
				console.warn('setRemoteDescription: no pc for', userSocketId);
				return;
			}
			try {
				await pc.setRemoteDescription(new RTCSessionDescription(answer));
				console.log('Remote description (answer) set for', userSocketId);

				flushIceQueue(userSocketId);
			} catch (err) {
				console.error('Error setting remote description', err);
			}
		},
		[peerConnections, flushIceQueue]
	);

	const handleAddIceCandidate = useCallback(
		async ({
			iceCandidate,
			socketId,
		}: {
			iceCandidate: any;
			socketId: string;
		}) => {
			const pc = peerConnections.get(socketId);
			if (pc && pc.remoteDescription?.type) {
				try {
					await pc.addIceCandidate(iceCandidate);
				} catch (err) {
					console.error('Error adding ICE candidate to pc', err);
				}
			} else {
				// Queue candidate until pc exists
				const queue = iceCandidateQueues.get(socketId) || [];
				queue.push(iceCandidate);
				iceCandidateQueues.set(socketId, queue);
				console.log('Queued ICE candidate for', socketId);
			}
		},
		[peerConnections, iceCandidateQueues]
	);

	const disconnectPeer: IWebRTCContext['disconnectPeer'] = useCallback(
		({ user }) => {
			const socketId = user.socketId;
			const pc = peerConnections.get(socketId);
			pc?.close();
			peerStreams.delete(socketId);
			setStreams(Array.from(peerStreams.values()));
			peerConnections.delete(socketId);
			iceCandidateQueues.delete(socketId);
		},
		[iceCandidateQueues, peerConnections, peerStreams]
	);

	const resetRemotePeers: IWebRTCContext['resetRemotePeers'] =
		useCallback(() => {
			if (localStream.current) {
				console.log('Resetting peers');
				peerConnections.forEach((value) => value.close());
				localStream.current.getTracks().forEach((track) => track.stop());
				setLocalStream(null);
			}
		}, [peerConnections, setLocalStream]);

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
