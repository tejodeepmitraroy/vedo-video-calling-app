'use client';
import React, { useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'react-toastify';
import ControlPanel from './components/ControlPanel';
import UserVideoPanel from '../components/UserVideoPanel';

import RemoteUserVideoPanel from './components/RemoteUserVideoPanel';
// import ScreenSharePanel from '../components/ui/ScreenSharePanel';
import Image from 'next/image';
import useStreamStore from '@/store/useStreamStore';
import WebRTC from '@/services/webRTC';

const ConferenceRoom = ({ roomId }: { roomId: string }) => {
	// const localStream = useRoomStore((state) => state.localStream);
	// const localScreenStream = useRoomStore((state) => state.localScreenStream);
	// const isMicrophoneOn = useStreamStore((state) => state.isMicrophoneOn);
	// const [remoteStream, setRemoteStream] = useState<MediaStream>();
	const remoteSocketId = useStreamStore((state) => state.remoteSocketId);
	const setRemoteSocketId = useStreamStore((state) => state.setRemoteSocketId);
	const peerOffer = useStreamStore((state) => state.peerOffer);
	const remoteStream = WebRTC.getRemoteStream();

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
	const handleInformAllNewUserAdded = useCallback(
		({ userId: id, username }: { userId: string; username: string }) => {
			console.log('Notiof', { userId, username });

			if (id === userId) {
				toast.success(`suceesfully joined`);
			} else {
				toast(`${username} Joined`);
			}
		},
		[userId]
	);

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

			const answer = await WebRTC.createAnswer(offer);

			console.log(` HOST created answer----->`, answer);

			console.log(` HOST's offer-------->`, peerOffer);

			setRemoteSocketId(socketId);
			socketEmit('event:roomEnterPermissionAccepted', {
				socketId,
				answer,
				hostOffer: peerOffer,
			});
			// handleCallUser(socketId);
		},
		[peerOffer, setRemoteSocketId, socketEmit]
	);

	console.log('Created Offer =====>', peerOffer);

	const roomEnterPermissionDenied = useCallback(
		(socketId: string) => {
			socketEmit('event:roomEnterPermissionDenied', { socketId });
		},
		[socketEmit]
	);

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
					</div>
				</div>,
				{
					onClose: () => roomEnterPermissionDenied(socketId),
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

			await WebRTC.addAnswer(answer);
		},
		[]
	);

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
		socketOn('notification:informAllNewUserAdded', handleInformAllNewUserAdded);
		socketOn('notification:userLeftTheRoom', handleUserLeftTheRoom);

		return () => {
			socketOff(
				'notification:informAllNewUserAdded',
				handleInformAllNewUserAdded
			);
			socketOff('notification:userLeftTheRoom', handleUserLeftTheRoom);
		};
	}, [handleInformAllNewUserAdded, handleUserLeftTheRoom, socketOff, socketOn]);

	return (
		<div className="h-screen w-full">
			<div className="flex flex-col">
				<main className="relative h-full w-full overflow-hidden">
					<div className="flex h-[91vh] w-full items-center justify-center bg-black">
						<div className="absolute top-2 z-30 rounded-xl bg-white p-5 text-black">
							{roomId}
						</div>
						{/* <div className="flex h-full w-full max-w-7xl items-center justify-center rounded-xl sm:aspect-video sm:border-2 sm:border-white"> */}
						<div className="flex h-full w-full max-w-[90rem] items-center justify-center rounded-xl">
							{remoteStream ? (
								<>
									<RemoteUserVideoPanel stream={remoteStream} />
									<div className="absolute bottom-[12vh] right-8 z-40 aspect-square w-[20%] resize rounded-xl border border-white sm:aspect-video md:bottom-[15vh] md:right-16 md:w-[12%]">
										<UserVideoPanel />
									</div>
								</>
							) : (
								<UserVideoPanel />
							)}
							{/* <ScreenSharePanel /> */}
						</div>
						{/* <div className="flex h-full w-full flex-col gap-3 overflow-y-auto md:flex-row">
							<div className="relative flex h-full w-full items-center justify-center rounded-xl border-2 border-white bg-black sm:h-1/2 md:aspect-video md:h-auto md:w-1/2">
								<UserVideoPanel stream={stream} muted={!isMicrophoneOn} />
							</div>
							<div className="relative flex h-full w-full items-center justify-center rounded-xl border-2 border-white bg-black sm:h-1/2 md:aspect-video md:h-auto md:w-1/2">
								<UserVideoPanel stream={stream} muted={!isMicrophoneOn} />
							</div>
						</div>
						{/* {localScreenStream ? (
							<div className="flex h-full w-full">
								<div className="relative flex aspect-video w-[75%] items-center justify-center">
									<ScreenSharePanel />
								</div>
								<div className="flex w-[25%] flex-col justify-center gap-5 p-5">
									<RemoteUserVideoPanel stream={remoteStream} />
									<UserVideoPanel muted={!isMicrophoneOn} />
								</div>
							</div>
						) : remoteStream ? (
							<>
								<RemoteUserVideoPanel stream={remoteStream} />
								<div className="absolute bottom-[12vh] right-8 z-40 aspect-square w-[20%] resize rounded-xl border border-white sm:aspect-video md:bottom-[15vh] md:right-16 md:w-[12%]">
									<UserVideoPanel muted={true} />
								</div>
							</>
						) : (
							<UserVideoPanel muted={!isMicrophoneOn} />
						)} */}
					</div>
					<div className="h-[10vh] w-full md:h-[9vh]">
						<ControlPanel roomId={roomId} />
					</div>

					<div className="absolute right-10 top-[15vh] z-40 w-1/6 bg-white">
						<h4>{remoteSocketId ? 'Connected' : 'No one in this Room'}</h4>
						{/* {remoteSocketId && (
							<Button >Call</Button>
							// <Button onClick={() => handleCallUser()}>Call</Button>
						)} */}

						{/* {stream && <Button onClick={sendStreams}>Send Stream</Button>} */}
					</div>

					{/* {remoteStream && (
						
					)} */}
				</main>
			</div>
		</div>
	);
};

export default ConferenceRoom;
