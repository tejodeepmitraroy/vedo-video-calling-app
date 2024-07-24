'use client';
import React, { useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'react-toastify';
import UserVideoPanel from '../@waitingLobby/components/UserVideoPanel';
// import ScreenSharePanel from '../components/ui/ScreenSharePanel';
import Image from 'next/image';
import useStreamStore from '@/store/useStreamStore';

import ControlPanel from './components/ControlPanel';
import { useWebRTC } from '@/context/WebRTCContext';

const MeetingRoom = ({ roomId }: { roomId: string }) => {
	// const localStream = useRoomStore((state) => state.localStream);
	// const localScreenStream = useRoomStore((state) => state.localScreenStream);
	// const isMicrophoneOn = useStreamStore((state) => state.isMicrophoneOn);
	// const [remoteStream, setRemoteStream] = useState<MediaStream>();
	const remoteSocketId = useStreamStore((state) => state.remoteSocketId);
	const setRemoteSocketId = useStreamStore((state) => state.setRemoteSocketId);
	const peerOffer = useStreamStore((state) => state.peerOffer);
	const {
		peer,
		getRemoteStream,
		createOffer,
		getAnswer,
		setRemoteDescription,
		connectionStatus,
	} = useWebRTC();

	// const remoteStream = webRTC.getRemoteStream();
	const remoteStream = getRemoteStream();

	console.log('Remote Users Stream--------->', remoteStream);

	console.log('Remote socket ID------>>>>>', remoteSocketId);

	const { userId } = useAuth();

	const { socket, socketOn, socketEmit, socketOff } = useSocket();

	console.log('Meeting Component mounted++++++++++');

	// const handleUserJoined = useCallback(
	// 	({ userId, id }: { userId: string; id: string }) => {
	// 		console.log('User Joined', userId);
	// 		console.log('Socket User Joined', id);
	// 		// setRemoteSocketId(id);
	// 	},
	// 	[]
	// );

	// const handleCallUser = useCallback(
	// 	async (remoteSocketId: string | null) => {
	// 		const offer = await webRTCService.getOffer();
	// 		console.log('creating a Offer--->', offer);
	// 		socketEmit('event:callUser', { to: remoteSocketId, offer });
	// 	},
	// 	[remoteSocketId]
	// );

	// const handleIncomingCall = useCallback(
	// 	async ({
	// 		from,
	// 		offer,
	// 	}: {
	// 		from: string;
	// 		offer: RTCSessionDescriptionInit;
	// 	}) => {
	// 		setRemoteSocketId(from);
	// 		console.log('Incoming Call--->', { from, offer });

	// 		// const answer = await webRTCService.getAnswer(offer);
	// 		console.log('Creating Answer--->', answer);

	// 		socket?.emit('call:accepted', { to: from, answer });
	// 	},
	// 	[setRemoteSocketId, socket]
	// );

	// const handleAcceptedCall = useCallback(
	// 	async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
	// 		await webRTCService.setLocalDescription(answer);
	// 		console.log('call Accepted and Now Sending Stream-->>');

	// 		// sendStreams();
	// 		// for (const track of stream?.getTracks()) {
	// 		// 	peer.peer?.addTrack(track,stream);
	// 		// }
	// 		// console.log('stream-->', stream?.getTracks());
	// 		localStream?.getTracks().forEach((track: MediaStreamTrack) => {
	// 			// console.log('Track---->', track);
	// 			webRTCService.peer?.addTrack(track, localStream);
	// 		});
	// 	},
	// 	[localStream]
	// );

	// const handleNegoNeeded = useCallback(async () => {
	// 	const offer = await webRTCService.getOffer();
	// 	socket?.emit('peer:nego:needed', { offer, to: remoteSocketId });
	// }, [remoteSocketId, socket]);

	// const handleNegoNeedIncoming = useCallback(
	// 	async ({
	// 		from,
	// 		offer,
	// 	}: {
	// 		from: string;
	// 		offer: RTCSessionDescriptionInit;
	// 	}) => {
	// 		const answer = await webRTCService.getAnswer(offer);

	// 		console.log('peer:nego:done----> ', answer);

	// 		socket?.emit('peer:nego:done', { to: from, answer });
	// 		handleCallUser(remoteSocketId);
	// 	},
	// 	[socket]
	// );

	// const handleNegoNeedFinal = useCallback(
	// 	async ({ answer }: { from: string; answer: RTCSessionDescriptionInit }) => {
	// 		console.log('Final Answer---->', answer);
	// 		await webRTCService.setLocalDescription(answer);
	// 		// handleCallUser(remoteSocketId);
	// 	},
	// 	[]
	// );

	// const sendStreams = useCallback(() => {
	// 	console.log('send stream-->', stream);
	// 	stream?.getTracks().forEach((track) => {
	// 		console.log('Send track-->', track);
	// 		peer.peer?.addTrack(track, stream);
	// 	});
	// }, [stream]);

	// useEffect(() => {
	// 	webRTCService.peer?.addEventListener('negotiationneeded', handleNegoNeeded);

	// 	return () => {
	// 		webRTCService.peer?.removeEventListener(
	// 			'negotiationneeded',
	// 			handleNegoNeeded
	// 		);
	// 	};
	// }, [handleNegoNeeded]);

	// useEffect(() => {
	// 	webRTCService.peer?.addEventListener('track', async (event) => {
	// 		const [remoteStream] = event.streams;

	// 		console.log('Remote Stream---->', remoteStream.getTracks());

	// 		setRemoteStream(remoteStream);
	// 	});
	// }, []);

	useEffect(() => {
		// socketOn('event:UserJoined', handleUserJoined);
		// socketOn('incoming:call', handleIncomingCall);
		// socketOn('call:accepted', handleAcceptedCall);
		// socketOn('peer:nego:needed', handleNegoNeedIncoming);
		// socketOn('peer:nego:final', handleNegoNeedFinal);

		return () => {
			// socketOff('event:UserJoined', handleUserJoined);
			// socketOff('incoming:call', handleIncomingCall);
			// socketOff('call:accepted', handleAcceptedCall);
			// socketOff('peer:nego:needed', handleNegoNeedIncoming);
			// socketOff('peer:nego:final', handleNegoNeedFinal);
		};
	}, [
		// handleAcceptedCall,
		// handleIncomingCall,
		// handleNegoNeedFinal,
		// handleNegoNeedIncoming,
		// handleUserJoined,
		socket,
	]);

	// console.log('Meetroom--------->', localStream);

	//// All socket Notification Function are Define Here
	// const handleInformAllNewUserAdded = useCallback(
	// 	({ userId: id, username }: { userId: string; username: string }) => {
	// 		console.log('Notiof', { userId, username });

	// 		if (id === userId) {
	// 			toast.success(`suceesfully joined`);
	// 		} else {
	// 			toast(`${username} Joined`);
	// 		}
	// 	},
	// 	[userId]
	// );

	const handleUserLeftTheRoom = useCallback(
		({ userId: id }: { userId: string }) => {
			if (id === userId) {
				toast.success(`You Left the Room`);
			} else {
				setRemoteSocketId(null);
				toast.info(`${id} Left the Room`);
			}
		},
		[setRemoteSocketId, userId]
	);

	///// All socket Event Function are Define Here
	const roomEnterPermissionAccepted = useCallback(
		async (socketId: string, offer: RTCSessionDescriptionInit) => {
			console.log(socketId);

			console.log(` Client's client------->`, offer);

			// const answer = await webRTC.getAnswer(offer);
			const answer = await getAnswer(offer);

			console.log(` HOST created answer----->`, answer);

			console.log(` HOST's offer-------->`, peerOffer);

			// const hostOffer = await webRTC.createOffer();
			const hostOffer = await createOffer();
			setRemoteSocketId(socketId);
			socketEmit('event:roomEnterPermissionAccepted', {
				socketId,
				answer,
				// hostOffer: peerOffer,
				hostOffer: hostOffer,
			});
			// handleCallUser(socketId);
		},
		[createOffer, getAnswer, peerOffer, setRemoteSocketId, socketEmit]
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
			offer,
		}: {
			username: string;
			profilePic: string;
			socketId: string;
			offer: RTCSessionDescriptionInit;
		}) => {
			toast(
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
							onClick={() => roomEnterPermissionAccepted(socketId, offer)}
						>
							Accept
						</Button>
						<Button
							size={'sm'}
							variant={'default'}
							onClick={() => roomEnterPermissionDenied(socketId)}
						>
							Rejected
						</Button>
					</div>
				</div>,
				{
					// onClose: () => roomEnterPermissionDenied(socketId),
					position: 'top-center',
					autoClose: false,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: 'light',
				}
			);
		},
		[roomEnterPermissionAccepted, roomEnterPermissionDenied]
	);

	const handleSendAnswerHost = useCallback(
		async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
			console.log('Final Negotiation is completed', answer);

			// await webRTC.setRemoteDescription(answer);
			setRemoteDescription(answer);
		},
		[setRemoteDescription]
	);

	////////////////////////////////////////////////////////////////////////////////////////////

	const handleSendIceCandidate = useCallback(
		(event: any) => {
			{
				if (event.candidate) {
					console.log('remoteSocketId', remoteSocketId);
					console.log(
						'=========================Sending Ice Candidate=================='
					);
					socketEmit('event:sendIceCandidate', {
						remoteSocketId,
						iceCandidate: event.candidate,
					});
				}
			}
		},
		[remoteSocketId, socketEmit]
	);

	useEffect(() => {
		peer?.addEventListener('icecandidate', handleSendIceCandidate);

		return () => {
			// webRTC.peer?.removeEventListener('icecandidate', handleSendIceCandidate);
			peer?.removeEventListener('icecandidate', handleSendIceCandidate);
		};
	}, [handleSendIceCandidate, peer]);

	const handleAddIceCandidate = useCallback(
		async ({ iceCandidate }: { iceCandidate: any }) => {
			if (iceCandidate) {
				try {
					console.log(
						'=========================Get Ice Candidate=================='
					);
					// await webRTC.peer?.addIceCandidate(iceCandidate);
					await peer?.addIceCandidate(iceCandidate);
				} catch (e) {
					console.error('Error adding received ice candidate', e);
				}
			}
		},
		[peer]
	);

	useEffect(() => {
		socketOn('event:sendIceCandidate', handleAddIceCandidate);
		return () => {
			socketOff('event:sendIceCandidate', handleAddIceCandidate);
		};
	}, [handleAddIceCandidate, socketOff, socketOn]);

	///////////////////////////////////////////////////////////////////////////////////////////

	///// All socket Event Function are Executed Here

	useEffect(() => {
		socketOn('event:userWantToEnter', userWantToEnter);
		socketOn('event:sendAnswerHost', handleSendAnswerHost);

		return () => {
			socketOff('event:userWantToEnter', userWantToEnter);
			socketOff('event:sendAnswerHost', handleSendAnswerHost);
		};
	}, [handleSendAnswerHost, socketOff, socketOn, userWantToEnter]);

	//All Notifications Event state here
	useEffect(() => {
		socketOn('notification:userLeftTheRoom', handleUserLeftTheRoom);

		return () => {
			socketOff('notification:userLeftTheRoom', handleUserLeftTheRoom);
		};
	}, [handleUserLeftTheRoom, socketOff, socketOn]);

	return (
		<div className="flex flex-1 flex-col rounded-lg bg-background bg-black shadow-sm">
			<main className="relative h-full w-full">
				<div className="flex h-[92.5%] w-full items-center justify-center">
					{/* <div className="absolute top-2 z-30 rounded-xl bg-white p-5 text-black">
						{roomId}
					</div> */}

					<div className="flex h-full w-full max-w-[90rem] items-center justify-center rounded-xl">
						{remoteStream ? (
							<>
								{/* <RemoteUserVideoPanel stream={remoteStream} /> */}
								<div className="absolute bottom-[12vh] right-8 z-40 aspect-square w-[20%] resize rounded-xl border border-white sm:aspect-video md:bottom-[15vh] md:right-16 md:w-[12%]">
									<UserVideoPanel />
								</div>
							</>
						) : (
							<UserVideoPanel />
						)}
						{/* <ScreenSharePanel /> */}
					</div>
				</div>

				<div className="h-[7.5%] w-full">
					<ControlPanel roomId={roomId} />
				</div>

				{/* <div className="absolute right-10 top-[15vh] z-40 w-1/6 bg-white">
					<h4>{remoteSocketId ? 'Connected' : 'No one in this Room'}</h4>
				</div> */}
			</main>
		</div>
	);
};

export default MeetingRoom;
