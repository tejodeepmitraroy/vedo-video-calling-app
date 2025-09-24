'use client';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSocket } from '@/context/SocketContext';
import useParticipantsStore from '@/store/useParticipantsStore';
import useStreamStore from '@/store/useStreamStore';
import { useAuth } from '@clerk/nextjs';

import { RWebShare } from 'react-web-share';
import SettingsDialog from './SettingsDialog';
import {
	Check,
	ChevronUp,
	EllipsisVertical,
	Info,
	Mic,
	MicOff,
	Phone,
	ScreenShare,
	ScreenShareOff,
	Settings,
	Share2,
	Users,
	Video,
	VideoOff,
} from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import useDeviceStore from '@/store/useDeviceStore';

const ControlPanel = ({ roomId }: { roomId: string }) => {
	const toggleCamera = useStreamStore((state) => state.toggleCamera);
	const toggleMicrophone = useStreamStore((state) => state.toggleMicrophone);
	const isCameraOn = useStreamStore((state) => state.isCameraOn);
	const isMicrophoneOn = useStreamStore((state) => state.isMicrophoneOn);
	const participants = useParticipantsStore((state) => state.participants);
	const isScreenSharing = useStreamStore((state) => state.isScreenSharing);
	const toggleScreenShare = useStreamStore((state) => state.toggleScreenShare);
	const mediaDevices = useDeviceStore((state) => state.mediaDevices);
	const setSelectedMicrophone = useDeviceStore(
		(state) => state.setSelectedMicrophone
	);
	const setSelectedCamera = useDeviceStore((state) => state.setSelectedCamera);
	const selectedMicrophone = useDeviceStore(
		(state) => state.selectedMicrophone
	);
	const selectedCamera = useDeviceStore((state) => state.selectedCamera);

	const { socketEmit } = useSocket();
	const { userId } = useAuth();

	const currentUser = participants.find(
		(participant) => participant.userId === userId
	);

	console.log(
		'participants,currentUser=============>',
		participants,
		currentUser
	);

	const handleLeaveRoom = useCallback(() => {
		if (currentUser?.host) {
			if (participants.length === 1) {
				socketEmit('event:callEnd', {
					roomId,
				});
			} else {
				toast.error(
					'Please, set another participant as host to leave the room '
				);
			}
		} else {
			socketEmit('event:callEnd', {
				roomId,
			});
		}
	}, [currentUser?.host, participants.length, roomId, socketEmit]);

	const handleEndRoom = useCallback(() => {
		socketEmit('event:endRoom', { roomId });
	}, [roomId, socketEmit]);

	const handleKickUser = useCallback(
		(socketId: string) => {
			socketEmit('event:kickUser', { roomId, socketId });
		},
		[roomId, socketEmit]
	);
	const handleChangeHost = useCallback(
		(socketId: string) => {
			socketEmit('event:changeHost', { roomId, socketId });
		},
		[roomId, socketEmit]
	);

	return (
		<div className="absolute bottom-0 left-0 z-50 grid h-16 w-full grid-cols-1 justify-between border-gray-200 px-8 md:grid-cols-3 dark:border-gray-600 dark:bg-gray-700">
			<div className="hidden w-full items-center justify-start gap-3 text-white md:flex dark:text-gray-400">
				<span>{roomId}</span>
			</div>

			<div className="flex w-full items-center justify-center gap-4">
				<div className="mx-auto mb-4 flex h-fit items-center justify-center gap-4 rounded-md bg-white px-4 py-2">
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center gap-1 rounded-2xl border pl-1">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<ChevronUp />
									</DropdownMenuTrigger>
									<DropdownMenuContent className="z-30 mb-6">
										{mediaDevices?.microphones.map((microphone) => (
											<DropdownMenuItem
												key={microphone.deviceId}
												onClick={() =>
													setSelectedMicrophone(microphone.deviceId)
												}
												className={cn(
													'flex items-center gap-2',
													selectedMicrophone.deviceId === microphone.deviceId &&
														'text-primary'
												)}
											>
												<Check
													className={cn(
														'h-5 w-5',
														selectedMicrophone.deviceId === microphone.deviceId
															? 'text-primary'
															: 'opacity-0'
													)}
												/>
												{microphone.label}
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
								<Button
									data-tooltip-target="tooltip-camera"
									variant={isMicrophoneOn ? 'default' : 'destructive'}
									onClick={() => toggleMicrophone()}
									type="button"
									className="group rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
								>
									{isMicrophoneOn ? (
										<Mic className="h-6 w-6" />
									) : (
										<MicOff className="h-6 w-6" />
									)}
									<span className="sr-only">Mute Microphone</span>
								</Button>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>Mute Microphone</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center gap-1 rounded-2xl border pl-1">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<ChevronUp />
									</DropdownMenuTrigger>
									<DropdownMenuContent className="z-30 mb-6">
										{mediaDevices?.cameras.map((camera) => (
											<DropdownMenuItem
												key={camera.deviceId}
												onClick={() => setSelectedCamera(camera.deviceId)}
												className={cn(
													'flex items-center gap-2',
													selectedCamera.deviceId === camera.deviceId &&
														'text-primary'
												)}
											>
												<Check
													className={cn(
														'h-5 w-5',
														selectedCamera.deviceId === camera.deviceId
															? 'text-primary'
															: 'opacity-0'
													)}
												/>
												{camera.label}
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
								<Button
									data-tooltip-target="tooltip-camera"
									variant={isCameraOn ? 'default' : 'destructive'}
									onClick={() => toggleCamera()}
									type="button"
									className="group rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
								>
									{isCameraOn ? (
										<Video className="h-6 w-6" />
									) : (
										<VideoOff className="h-6 w-6" />
									)}
									<span className="sr-only">Hide camera</span>
								</Button>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>Camera On/Off</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger>
							<Button
								data-tooltip-target="tooltip-camera"
								variant={isScreenSharing ? 'destructive' : 'default'}
								onClick={() => toggleScreenShare()}
								type="button"
								className="group rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
							>
								{isScreenSharing ? (
									<ScreenShareOff className="h-6 w-6" />
								) : (
									<ScreenShare className="h-6 w-6" />
								)}
								<span className="sr-only">Hide camera</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Screen Sharing On/Off</p>
						</TooltipContent>
					</Tooltip>

					{currentUser?.host ? (
						<Tooltip>
							<TooltipTrigger asChild>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant={'destructive'}
											data-tooltip-target="tooltip-microphone"
											type="button"
											className="group rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
										>
											<Phone className="h-6 w-7" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuLabel>As a Host</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem onClick={() => handleLeaveRoom()}>
											Leave Room
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => handleEndRoom()}>
											End Room
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TooltipTrigger>
							<TooltipContent>
								<p>Leave Room</p>
							</TooltipContent>
						</Tooltip>
					) : (
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant={'destructive'}
									data-tooltip-target="tooltip-microphone"
									type="button"
									onClick={() => handleLeaveRoom()}
									className="group rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
								>
									<Phone className="h-6 w-7" />
									<span className="sr-only">Leave</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Leave Room</p>
							</TooltipContent>
						</Tooltip>
					)}

					<Tooltip>
						<TooltipTrigger asChild>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										data-tooltip-target="tooltip-microphone"
										type="button"
										className="group rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
									>
										<EllipsisVertical className="h-6 w-7" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-full max-w-2xl">
									<DropdownMenuLabel>Options</DropdownMenuLabel>
									<DropdownMenuSeparator />

									<RWebShare
										data={{
											text: 'Share',
											url: window.location.href,
											title: 'roomUrl',
										}}
										onClick={() => console.log('roomUrl shared successfully!')}
									>
										<DropdownMenuItem className="w-full gap-1.5 text-sm">
											<Share2 className="h-6 w-6" />
											Share
										</DropdownMenuItem>
									</RWebShare>
									<SettingsDialog>
										<DropdownMenuItem className="w-full gap-1.5 text-sm">
											<Settings className="h-6 w-6" />
											Settings
										</DropdownMenuItem>
									</SettingsDialog>
								</DropdownMenuContent>
							</DropdownMenu>
						</TooltipTrigger>
						<TooltipContent>
							<p>Options</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</div>

			<div className="flex w-full items-center justify-end gap-4">
				<div className="mb-4 flex h-fit items-center justify-center gap-4 rounded-md px-4 py-2">
					<Tooltip>
						<TooltipTrigger asChild>
							<Dialog>
								<DialogTrigger className="flex w-full items-center gap-1.5 text-sm">
									<Button
										data-tooltip-target="tooltip-microphone"
										type="button"
										className="group rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
									>
										<Users className="h-6 w-7" />
									</Button>
								</DialogTrigger>
								<DialogContent className="flex flex-col gap-2">
									<DialogHeader>
										<DialogTitle>Participants</DialogTitle>
									</DialogHeader>
									<Separator />

									{participants.find(
										(participant) =>
											participant.userId === userId && participant.host === true
									) ? (
										<ScrollArea className="flex h-[500px] w-full max-w-[600px] flex-col gap-2 rounded-lg border-gray-200">
											{participants.map((participant) => (
												<div
													className="flex w-full items-center justify-between gap-3 rounded-lg p-2"
													key={participant.userId}
												>
													<Avatar className="h-7 w-7">
														<AvatarImage src={participant.imageUrl} />
													</Avatar>
													<div className="flex flex-col">
														<span className="text-sm font-semibold">
															{participant.fullName}
														</span>
														<span className="text-xs">
															{participant.host && <span>(Meeting Host)</span>}
														</span>
													</div>

													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant={'outline'}
																className="group rounded-full p-1 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
															>
																<EllipsisVertical />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent>
															<DropdownMenuLabel>
																Meeting Options
															</DropdownMenuLabel>
															{!participant.host ? (
																<>
																	<DropdownMenuItem
																		onClick={() =>
																			handleKickUser(participant.socketId)
																		}
																	>
																		Kick Out
																	</DropdownMenuItem>
																	<DropdownMenuItem
																		onClick={() =>
																			handleChangeHost(participant.socketId)
																		}
																	>
																		Change to Host
																	</DropdownMenuItem>
																</>
															) : (
																<DropdownMenuItem>
																	Leave Meeting
																</DropdownMenuItem>
															)}
														</DropdownMenuContent>
													</DropdownMenu>
												</div>
											))}
										</ScrollArea>
									) : (
										<ScrollArea className="flex h-[500px] w-full max-w-[600px] flex-col gap-2 rounded-lg border-gray-200">
											{participants.map((participant) => (
												<div
													className="flex w-full items-center justify-between gap-3 rounded-lg p-2"
													key={participant.userId}
												>
													<Avatar className="h-7 w-7">
														<AvatarImage src={participant.imageUrl} />
													</Avatar>
													<div className="flex flex-col">
														<span className="text-sm font-semibold">
															{participant.fullName}
														</span>
														<span className="text-xs">
															{participant.host && <span>(Meeting Host)</span>}
														</span>
													</div>

													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant={'outline'}
																className="group rounded-full p-1 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
															>
																<EllipsisVertical />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent>
															<DropdownMenuLabel>
																Meeting Options
															</DropdownMenuLabel>
															{participant.userId === userId ? (
																<DropdownMenuItem
																	onClick={() => handleLeaveRoom()}
																>
																	Leave Meeting
																</DropdownMenuItem>
															) : (
																<DropdownMenuItem>No Options</DropdownMenuItem>
															)}
														</DropdownMenuContent>
													</DropdownMenu>
												</div>
											))}
										</ScrollArea>
									)}
								</DialogContent>
							</Dialog>
						</TooltipTrigger>
						<TooltipContent>
							<p>Participants</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger>
							<Button
								variant={'outline'}
								className="group rounded-full p-2.5 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
							>
								<Info className="h-4 w-4" />
								<span className="sr-only">Show information</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Show information</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</div>
	);
};

export default ControlPanel;
