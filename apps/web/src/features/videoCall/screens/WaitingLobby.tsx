'use client';
import { Button } from '@/components/ui/button';
import { Share, Share2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { CopyButton } from '@/components/ui/shadcn-io/copy-button';

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
		<section className="flex h-full w-full flex-col gap-10 overflow-y-auto p-4 md:flex-row">
			{/* <section className="w-full sm:hidden">
				<h1 className="relative flex h-full w-full flex-col items-center justify-center text-lg font-semibold sm:p-5 md:w-[50%] md:px-10">
					{roomDetails ? roomDetails.title : <Spinner />}
				</h1>
			</section> */}

			<div className="relative flex h-full w-full flex-col items-center justify-center sm:p-5 md:w-[50%] md:px-10">
				<div className="relative aspect-video w-full">
					<UserVideoPanel />
					<MediaControls />
					<MediaSettings />
				</div>
			</div>
			<div className="flex h-full w-full items-center justify-center md:w-[50%] md:justify-start md:p-5">
				<section className="mt-10 flex w-full max-w-lg flex-col items-center justify-center gap-4 md:hidden">
					<div>
						{canJoin ? (
							<Button
								className="scale-130 rounded-2xl text-lg"
								onClick={() => handleJoinRoom()}
							>
								Join Room
							</Button>
						) : (
							<Button
								className="scale-130 rounded-2xl text-lg"
								disabled={askToEnterLoading}
								onClick={() => handleAskToJoin()}
							>
								{askToEnterLoading ? <Spinner /> : <>ask to Join</>}
							</Button>
						)}
					</div>
					<div className="mt-6 flex w-full justify-between pr-2">
						<span className="font-medium">Joining Information</span>
						<RWebShare
							data={{
								text: `To join the meeting on VEDO Meet, click this link: ${window.location.href} Or open Meet and enter this code: ${roomId}`,
								url: window.location.href,
								title: 'roomUrl',
							}}
							onClick={() => console.log('roomUrl shared successfully!')}
						>
							<Share2 className="size-6" />
						</RWebShare>
					</div>
					<section className="flex w-full flex-col items-center gap-2">
						<div className="flex w-full items-center justify-between">
							<h1 className="text-lg font-semibold">Meeting link</h1>
						</div>
						<div className="flex w-full items-center gap-3">
							<Input value={window.location.href} readOnly />
							<CopyButton
								content={window.location.href}
								onCopy={() => console.log('Link copied!')}
							/>
						</div>
					</section>
				</section>
				<Card className="hidden w-full max-w-[400px] flex-col border border-dashed md:flex">
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
		</section>
	);
};

export default WaitingLobby;
