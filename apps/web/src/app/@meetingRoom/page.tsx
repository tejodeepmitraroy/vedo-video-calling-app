'use client';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/context/SocketContext';
import toast from 'react-hot-toast';
import UserVideoPanel from '../@waitingLobby/components/UserVideoPanel';
import Image from 'next/image';
// import useStreamStore from '@/store/useStreamStore';
import NewControlPanel from './components/NewControlPanel';
import { useWebRTC2 } from '@/context/WebRTCContext2';
import RemoteUserVideoPanel from './components/RemoteUserVideoPanel';

const MeetingRoom = ({ roomId }: { roomId: string }) => {
	// const setRemoteSocketId = useStreamStore((state) => state.setRemoteSocketId);
	const peerConnections = useMemo(
		() => new Map<string, RTCPeerConnection>(),
		[]
	);

	const {
		peerStreams,
		createOffer,
		createAnswer,
		connectionStatus,
		createPeerConnection,
	} = useWebRTC2();

	const { socketOn, socketEmit, socketOff } = useSocket();

	console.log('Meeting Component mounted++++++++++');

	//////////////////////////////////////////////////////////////////////////////////////////////

	///// All socket Event Function are Define Here
	const roomEnterPermissionAccepted = useCallback(
		async (socketId: string) => {
			// console.log(socketId);

			// console.log(` Client's client------->`, offer);

			// console.log(` HOST created answer----->`, answer);

			// console.log(` HOST's offer-------->`, peerOffer);

			// const hostOffer = await createOffer();
			// setRemoteSocketId(socketId);
			socketEmit('event:roomEnterPermissionAccepted', {
				socketId,
				// answer,

				// hostOffer: hostOffer,
			});
		},
		[socketEmit]
	);

	const roomEnterPermissionDenied = useCallback(
		(socketId: string) => {
			socketEmit('event:roomEnterPermissionDenied', { socketId });
		},
		[socketEmit]
	);

	console.log('Connection Status========>', connectionStatus());

	const userWantToEnter = useCallback(
		async ({
			username,
			profilePic,
			socketId,
		}: {
			username: string;
			profilePic: string;
			socketId: string;
			offer: RTCSessionDescriptionInit;
		}) => {
			toast((t) => (
				<div className="w-full">
					<div className="flex">
						<div className="flex w-[20%] items-center justify-center">
							<Image
								src={profilePic}
								width={30}
								height={30}
								className="rounded-full"
								alt={'Profile Pic'}
							/>
						</div>
						<div className="w-[80%]">{username} Want to Enter</div>
					</div>
					<div className="flex justify-evenly">
						<Button
							size={'sm'}
							variant={'default'}
							onClick={() => {
								toast.dismiss(t.id);
								roomEnterPermissionAccepted(socketId);
							}}
						>
							Accept
						</Button>
						<Button
							size={'sm'}
							variant={'default'}
							onClick={() => {
								toast.dismiss(t.id);
								roomEnterPermissionDenied(socketId);
							}}
						>
							Rejected
						</Button>
					</div>
				</div>
			));
		},
		[roomEnterPermissionAccepted, roomEnterPermissionDenied]
	);

	////////////////////////////////////////////////////////////////////////////////////////////

	const handleParticipantsInRoom = useCallback(
		({
			participants,
		}: {
			participants: {
				socketId: string;
				userId: string;
				fullName: string;
				imageUrl: string;
				emailAddress: string;
				host: boolean;
			}[];
		}) => {
			console.log('ParticipantsInRoom=========>', participants);
		},
		[]
	);

	useEffect(() => {
		socketOn('event:new-user-connected', handleParticipantsInRoom);
		socketOn('event:user-disconnected', handleParticipantsInRoom);

		return () => {
			socketOff('event:new-user-connected', handleParticipantsInRoom);
			socketOff('event:user-disconnected', handleParticipantsInRoom);
		};
	}, [handleParticipantsInRoom, socketOff, socketOn]);

	///////////////////////////////////////////////////////////////////////////////////////////

	const handleCreatePeerConnection = useCallback(
		async ({ userSocketId }: { userSocketId: string }) => {
			const peerConnection = createPeerConnection(userSocketId);

			peerConnections.set(userSocketId, peerConnection);

			const offer = await createOffer(peerConnection);

			// peerConnection.ontrack = (event) => {
			// 	console.log('event.streams[0]==========>', event.streams[0]);

			// 	setPeers((prevPeers) => [...prevPeers, event.streams[0]]);
			// };

			socketEmit('event:sendOffer', { offer, userSocketId });
		},
		[createOffer, createPeerConnection, peerConnections, socketEmit]
	);

	// useEffect(() => {

	// 	peerConnections.forEach((value) => {

	// 		console.log('This is PEER Connections==========>', value);
	// 		value.addEventListener("track", (event) => {
	// 			console.log('event.streams[0]==========>', event.streams[0]);

	// 			// setPeers( [...peers, event.streams[0]]);
	// 		})
	// 	});

	// 	return () => {
	// 		peerConnections.forEach((value) => {
	// 			value.removeEventListener('track', (event) => {
	// 				console.log('event.streams[0]==========>', event.streams[0]);

	// 				setPeers([...peers, event.streams[0]]);
	// 			});
	// 		});
	// 	};
	// }, [peerConnections, peers]);

	const handleGetOffer = useCallback(
		async ({
			offer,
			socketId,
		}: {
			offer: RTCSessionDescriptionInit;
			socketId: string;
		}) => {
			const peerConnection = createPeerConnection(socketId);
			peerConnections.set(socketId, peerConnection);

			console.log('New Peer Connection===>', peerConnections, socketId);

			const answer = await createAnswer({ peerConnection, offer });

			socketEmit('event:sendAnswer', { answer, socketId });
			// handleCreatePeerConnection({ userSocketId:socketId });
		},
		[createAnswer, createPeerConnection, peerConnections, socketEmit]
	);

	const handleGetAnswer = useCallback(
		async ({
			answer,
			userSocketId,
		}: {
			answer: RTCSessionDescriptionInit;
			userSocketId: string;
		}) => {
			const peerConnection = peerConnections.get(userSocketId);

			console.log('New Peer Connection===>', peerConnection, userSocketId);
			console.log('New User Send Answer====>', answer);
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
					console.log(
						'=========================Get Ice Candidate=================='
						// iceCandidate
					);

					await peerConnection?.addIceCandidate(iceCandidate);

					// peerConnection?.addEventListener('track', (event) => {
					// 		console.log('event.streams[0]==========>', event.streams[0]);

					// 		setPeers([...peers, event.streams[0]]);
					// 	});
				} catch (error) {
					console.error('Error adding received ice candidate', error);
				}
			}
		},
		[peerConnections]
	);

	useEffect(() => {
		socketOn('user-connected', handleCreatePeerConnection);
		socketOn('offer', handleGetOffer);
		socketOn('answer', handleGetAnswer);
		socketOn('event:sendIceCandidate', handleAddIceCandidate);

		return () => {
			socketOff('user-connected', handleCreatePeerConnection);
			socketOff('offer', handleGetOffer);
			socketOff('answer', handleGetAnswer);
			socketOff('event:sendIceCandidate', handleAddIceCandidate);
		};
	}, [
		handleAddIceCandidate,
		handleCreatePeerConnection,
		handleGetAnswer,
		handleGetOffer,
		socketOff,
		socketOn,
	]);

	///////////////////////////////////////////////////////////////////////////////////////////

	///// All socket Event Function are Executed Here

	useEffect(() => {
		socketOn('event:userWantToEnter', userWantToEnter);
		// socketOn('event:sendAnswerHost', handleSendAnswerHost);

		return () => {
			socketOff('event:userWantToEnter', userWantToEnter);
			// socketOff('event:sendAnswerHost', handleSendAnswerHost);
		};
	}, [socketOff, socketOn, userWantToEnter]);

	console.log(
		'PEERS IN MEETING ROOM=================>>>>>',
		Object.values(peerStreams)
	);

	return (
		<main className="relative flex h-screen w-full overflow-hidden bg-[#222831]">
			<div className="flex h-full w-full justify-between gap-4 p-4 pb-20 sm:pb-4 md:pb-20">
				<div className="mx-auto flex w-full items-center justify-center md:max-w-[90rem]">
					{Object.values(peerStreams).map((stream, index) => (
						<RemoteUserVideoPanel key={index} stream={stream} />
					))}

					<div className="absolute bottom-[10vh] right-8 z-40 aspect-square w-[20%] resize sm:aspect-video md:bottom-[15vh] md:right-16 md:w-[20%] lg:w-[12%]">
						<UserVideoPanel />
					</div>
				</div>
			</div>

			<NewControlPanel roomId={roomId} />
		</main>
	);
};

export default MeetingRoom;
