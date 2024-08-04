'use client';
import React, { useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'react-toastify';
import UserVideoPanel from '../@waitingLobby/components/UserVideoPanel';
import Image from 'next/image';
import useStreamStore from '@/store/useStreamStore';

import ControlPanel from './components/ControlPanel';
import { useWebRTC } from '@/context/WebRTCContext';
import RemoteUserVideoPanel from './components/RemoteUserVideoPanel';

import useRoomStore from '@/store/useRoomStore';

const MeetingRoom = ({ roomId }: { roomId: string }) => {
	// const localStream = useRoomStore((state) => state.localStream);
	// const localScreenStream = useRoomStore((state) => state.localScreenStream);
	// const isMicrophoneOn = useStreamStore((state) => state.isMicrophoneOn);
	// const [remoteStream, setRemoteStream] = useState<MediaStream>();
	const remoteSocketId = useStreamStore((state) => state.remoteSocketId);
	const setRemoteSocketId = useStreamStore((state) => state.setRemoteSocketId);
	const setRoomState = useRoomStore((state) => state.setRoomState);
	const peerOffer = useStreamStore((state) => state.peerOffer);
	const {
		peer,
		getRemoteStream,
		createOffer,
		getAnswer,
		setRemoteDescription,
		connectionStatus,
		disconnectPeer,
	} = useWebRTC();

	// const remoteStream = webRTC.getRemoteStream();
	const remoteStream = getRemoteStream();

	console.log('Remote Users Stream--------->', remoteStream);

	console.log('Remote socket ID------>>>>>', remoteSocketId);

	const { userId } = useAuth();

	const { socketOn, socketEmit, socketOff } = useSocket();

	console.log('Meeting Component mounted++++++++++');

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

	//////////////////////////////////////////////////////////////////////////////////////////////

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

			// await webRTC.setRemoteDescription(answer);
			setRemoteDescription(answer);
		},
		[setRemoteDescription]
	);

	const handleRemoveEveryoneFromRoom = useCallback(async () => {
		toast.success(`Host End the Room`);
		disconnectPeer();
		setRoomState('outSideLobby');
	}, [disconnectPeer, setRoomState]);

	////////////////////////////////////////////////////////////////////////////////////////////

	const handleSendIceCandidate = useCallback(
		(event: any) => {
			{
				if (event.candidate) {
					console.log(
						'=========================Sending Ice Candidate=================='
					);
					socketEmit('event:sendIceCandidate', {
						iceCandidate: event.candidate,
					});
				}
			}
		},
		[socketEmit]
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
		socketOn('event:removeEveryoneFromRoom', handleRemoveEveryoneFromRoom);

		return () => {
			socketOff('event:userWantToEnter', userWantToEnter);
			socketOff('event:sendAnswerHost', handleSendAnswerHost);
			socketOff('event:removeEveryoneFromRoom', handleRemoveEveryoneFromRoom);
		};
	}, [
		handleRemoveEveryoneFromRoom,
		handleSendAnswerHost,
		socketOff,
		socketOn,
		userWantToEnter,
	]);

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
					<div className="flex h-full w-full max-w-[85rem] items-center justify-center rounded-xl">
						{remoteStream ? (
							<>
								<RemoteUserVideoPanel />
								<div className="absolute bottom-[10vh] right-8 z-40 aspect-square w-[20%] resize rounded-xl border border-white sm:aspect-video md:bottom-[15vh] md:right-16 md:w-[15%] lg:w-[12%]">
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
			</main>
		</div>
	);
};

export default MeetingRoom;
