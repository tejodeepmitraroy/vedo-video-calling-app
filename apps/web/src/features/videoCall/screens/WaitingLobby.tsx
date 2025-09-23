'use client';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useSocket } from '@/context/SocketContext';
import { RWebShare } from 'react-web-share';
import Spinner from '@/components/ui/spinner';
import dynamic from 'next/dynamic';
import UserVideoPanel from '@/features/videoCall/components/UserVideoPanel';
import useGlobalStore from '@/store/useGlobalStore';
import MediaSettings from '@/features/videoCall/components/MediaSettings';
import useStreamStore from '@/store/useStreamStore';
import useWaitingLobbySocket from '@/features/videoCall/hooks/useWaitingLobbySocket';

const MediaControls = dynamic(() => import('../components/MediaControls'));

const WaitingLobby = ({ roomId }: { roomId: string }) => {
	const { socketOn, socketOff } = useSocket();
	const roomDetails = useGlobalStore((state) => state.roomDetails);
	const [canJoin, setCanJoin] = useState<boolean>();
	const localStream = useStreamStore((state) => state.localStream);

	//// Previously joined User
	const handleDirectlyCanJoin = useCallback(
		({ directlyCanJoin }: { directlyCanJoin: boolean }) => {
			setCanJoin(directlyCanJoin);
		},
		[]
	);
	useEffect(() => {
		socketOn('event:directlyCanJoin', handleDirectlyCanJoin);
		return () => {
			socketOff('event:directlyCanJoin', handleDirectlyCanJoin);
		};
	}, [handleDirectlyCanJoin, socketOff, socketOn]);

	const { handleJoinRoom, handleAskToJoin, askToEnterLoading } =
		useWaitingLobbySocket(roomId);

	useEffect(() => {
		const initializeMedia = async () => {
			if (localStream) {
				const videoTracks = localStream.getVideoTracks();
				const audioTracks = localStream.getAudioTracks();
				if (videoTracks.length > 0 && audioTracks.length > 0) {
					console.log('Stream is valid');
				} else {
					console.log('Stream is invalid');
				}
			} else {
				console.log('No stream available');
			}
		};

		initializeMedia();
	}, [localStream]);

	////////////////////////////////////////////////////////////////////////////////////////////////////
	return (
		<div className="flex h-full w-full flex-col p-4 sm:flex-row">
			<div className="relative flex h-full w-full flex-col items-center justify-center sm:p-5 md:w-[50%] md:px-10">
				<div className="relative aspect-video w-full">
					<UserVideoPanel />
					<MediaControls />
					<MediaSettings />
				</div>
			</div>
			<div className="flex h-full w-full items-center justify-center md:w-[50%] md:justify-start md:p-5">
				<Card className="w-full max-w-[400px] border border-dashed">
					{roomDetails ? (
						<>
							<CardHeader>
								<div className="flex items-center justify-between">
									Title{' '}
									<RWebShare
										data={{
											text: `To join the meeting on VEDO Meet, click this link: ${window.location.href} Or open Meet and enter this code: ${roomId}`,
											url: window.location.href,
											title: 'roomUrl',
										}}
										onClick={() => console.log('roomUrl shared successfully!')}
									>
										<Button
											variant="outline"
											size="sm"
											className="ml-auto gap-1.5 text-sm"
										>
											<Share className="size-3.5" />
											Share
										</Button>
									</RWebShare>
								</div>
								<CardTitle>
									{roomDetails ? roomDetails.title : <Spinner />}
								</CardTitle>
								<div>Description</div>
								<CardDescription>
									{roomDetails ? roomDetails?.description : <Spinner />}
								</CardDescription>
							</CardHeader>

							<CardFooter className="item-center flex justify-evenly">
								{canJoin ? (
									<Button onClick={() => handleJoinRoom()}>Join Room</Button>
								) : (
									<Button
										disabled={askToEnterLoading}
										onClick={() => handleAskToJoin()}
									>
										{askToEnterLoading ? <Spinner /> : <>ask to Join</>}
									</Button>
								)}
							</CardFooter>
						</>
					) : (
						<div className="flex w-full items-center justify-center">
							<Spinner />
						</div>
					)}
				</Card>
			</div>
		</div>
	);
};

export default WaitingLobby;
