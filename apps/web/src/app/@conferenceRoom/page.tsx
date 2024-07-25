'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import { Clock, Plus, Rss, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import Image from 'next/image';

import { useSocket } from '@/context/SocketContext';
import { toast } from 'react-toastify';

import { useRouter } from 'next/navigation';

const ConferenceRoom = () => {
	const { getToken } = useAuth();
	const router = useRouter();

	// const friendListArray = useGlobalStore((state) => state.friendList);
	// const [friendList, setFriendList] = useState<
	// 	FriendListResponse[] | null | undefined
	// >();
	const [allScheduledRoomsDetails, setAllScheduledRoomsDetails] = useState<
		RoomDetails[]
	>([]);

	const { socketOn, socketOff } = useSocket();
	const [roomId, setRoomId] = useState<string>('');

	//////////////////////////////////////////////////////////////////////////////////////////

	const handleInstantCreateCall = async () => {
		const token = await getToken();
		console.log('Token---->', token);

		try {
			const { data } = await toast.promise(
				axios.post(
					`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/room`,
					{},
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
					}
				),

				{
					pending: 'Wait to create a new Room',
					success: 'New Room Created👌',
					error: 'Error happend, New Room Creation rejected 🤯',
				}
			);

			console.log(data.data);
			const roomId = data.data.roomId;
			// const userId = data.data.createdById;

			router.push(`?roomId=${roomId}`);
		} catch (error) {
			console.log(error);
		}
	};

	//////////////////////////////////////////////////////////////////////////////////////////
	const handleEnterRoom = async () => {
		const token = await getToken();
		console.log('Enter Room', roomId);
		if (roomId) {
			try {
				const { data } = await axios<ApiResponse>(
					`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/room?roomId=${roomId}`,
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
					}
				);

				console.log(data);

				router.push(`?roomId=${roomId}`);
			} catch (error) {
				console.log(error);
			}
		}
	};

	///////////////////////////////////////////////////////////////////////////////////////////

	const getRoomDetails = useCallback(async () => {
		const token = await getToken();
		// console.log('Token---->', token);

		try {
			const { data } = await axios<ApiResponse>(
				`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/room`,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				}
			);

			console.log(data);

			setAllScheduledRoomsDetails(data.data);
		} catch (error) {
			console.log(error);
		}
	}, [getToken]);

	console.log('allScheduledRoomsDetails', allScheduledRoomsDetails);

	// const handleCallUser = (userId: string) => {
	// 	socketEmit('callUser', { to: userId, userName: user?.fullName });
	// };

	const handleUserIsNotOnline = useCallback(() => {
		toast.warn(`User is Offline`);
	}, []);

	const convertTo24Hour = (isoString: Date) => {
		const date = new Date(isoString); // Create a Date object from the ISO string
		const hours = date.getHours().toString().padStart(2, '0'); // Extract hours and pad with '0' if necessary
		const minutes = date.getMinutes().toString().padStart(2, '0'); // Extract minutes and pad with '0' if necessary

		if (isoString) {
			return `${hours}:${minutes}`;
		} else {
			return '';
		}
	};

	useEffect(() => {
		getRoomDetails();
	}, [getRoomDetails]);

	useEffect(() => {
		socketOn('notification:userIsNotOnline', handleUserIsNotOnline);
		return () => {
			socketOff('notification:userIsNotOnline', handleUserIsNotOnline);
		};
	}, [handleUserIsNotOnline, socketOff, socketOn]);

	return (
		<div className="flex flex-1 rounded-lg bg-background shadow-sm">
			<div className="flex w-full gap-2">
				<div
					className={`h-full w-full rounded-lg border bg-card bg-slate-100 text-card-foreground shadow-sm md:max-w-[27rem] md:rounded-l-lg md:rounded-r-none`}
				>
					<div className="flex h-32 flex-col gap-2 space-y-1.5 p-3 md:p-6">
						<div className="flex w-full items-center gap-5">
							<Button
								// variant={'outline'}
								onClick={() => handleInstantCreateCall()}
								className="flex w-1/2 gap-2"
							>
								{' '}
								<Plus />
								Instant Room
							</Button>
							<Button className="flex w-1/2 gap-2">
								<Rss />
								Schedule Room
							</Button>
						</div>
						<div className="flex gap-3 text-sm text-muted-foreground">
							<Input
								onChange={(event) => setRoomId(event.target.value)}
								placeholder="Name, email"
							/>
							<Button onClick={() => handleEnterRoom()} className="flex gap-2">
								<Search />
								Join
							</Button>
						</div>
					</div>
					<div className="w-full pt-0 md:p-6">
						<ScrollArea className="h-[25rem] w-full rounded-md border bg-white p-0 md:h-[42rem] md:p-4">
							<div className="flex h-fit flex-col gap-3 p-2">
								{allScheduledRoomsDetails ? (
									allScheduledRoomsDetails.map((room) => (
										<Card
											key={room.id}
											className="flex w-full justify-between p-0 transition-all duration-200 ease-in-out hover:bg-primary hover:text-white"
										>
											<CardHeader className="p-2">
												<div className="flex h-10 w-10 items-center justify-center rounded-md border">
													<Image
														src={room.createdBy.image_url}
														alt={room.createdBy.first_name}
														width={60}
														height={60}
														className="flex items-center justify-center rounded-md"
													/>
												</div>
											</CardHeader>
											<CardContent className="flex w-full items-center justify-center p-0">
												<div className="flex gap-5">
													<div className="flex flex-col justify-between">
														<span className="font-bold">
															{convertTo24Hour(room.startTime!)}
														</span>
														<span className="text-xs">
															{convertTo24Hour(room.endTime!)}
														</span>
													</div>
													<div className="flex flex-col justify-between">
														<span className="truncate font-bold">
															{room.title}
														</span>
														<span className="truncate text-xs">
															{`${room.createdBy.first_name} ${room.createdBy.last_name}`}
														</span>
													</div>
												</div>
											</CardContent>
											<CardFooter className="flex items-center justify-center p-2">
												<Clock className="h-5 w-5" />
											</CardFooter>
										</Card>
									))
								) : (
									<>
										<Card className="z-0 flex w-full animate-pulse justify-between p-2 delay-1000 ease-in-out">
											<CardHeader className="flex aspect-square h-[60px] w-[60px] items-center justify-center p-0">
												<div className="flex aspect-square h-[50px] w-[50px] items-center justify-center rounded-md border bg-gray-200 dark:bg-gray-700"></div>
											</CardHeader>
											<CardContent className="flex w-full flex-col justify-center py-0 pl-5">
												<div className="flex flex-col justify-between">
													<div className="mb-4 h-2.5 max-w-[200px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
													<div className="h-2 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
												</div>
											</CardContent>
										</Card>
										<Card className="z-0 flex w-full animate-pulse justify-between p-2 delay-1000 ease-in-out">
											<CardHeader className="flex aspect-square h-[60px] w-[60px] items-center justify-center p-0">
												<div className="flex aspect-square h-[50px] w-[50px] items-center justify-center rounded-md border bg-gray-200 dark:bg-gray-700"></div>
											</CardHeader>
											<CardContent className="flex w-full flex-col justify-center py-0 pl-5">
												<div className="flex flex-col justify-between">
													<div className="mb-4 h-2.5 max-w-[200px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
													<div className="h-2 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
												</div>
											</CardContent>
										</Card>
										<Card className="z-0 flex w-full animate-pulse justify-between p-2 delay-1000 ease-in-out">
											<CardHeader className="flex aspect-square h-[60px] w-[60px] items-center justify-center p-0">
												<div className="flex aspect-square h-[50px] w-[50px] items-center justify-center rounded-md border bg-gray-200 dark:bg-gray-700"></div>
											</CardHeader>
											<CardContent className="flex w-full flex-col justify-center py-0 pl-5">
												<div className="flex flex-col justify-between">
													<div className="mb-4 h-2.5 max-w-[200px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
													<div className="h-2 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
												</div>
											</CardContent>
										</Card>
										<Card className="z-0 flex w-full animate-pulse justify-between p-2 delay-1000 ease-in-out">
											<CardHeader className="flex aspect-square h-[60px] w-[60px] items-center justify-center p-0">
												<div className="flex aspect-square h-[50px] w-[50px] items-center justify-center rounded-md border bg-gray-200 dark:bg-gray-700"></div>
											</CardHeader>
											<CardContent className="flex w-full flex-col justify-center py-0 pl-5">
												<div className="flex flex-col justify-between">
													<div className="mb-4 h-2.5 max-w-[200px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
													<div className="h-2 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
												</div>
											</CardContent>
										</Card>
										<Card className="z-0 flex w-full animate-pulse justify-between p-2 delay-1000 ease-in-out">
											<CardHeader className="flex aspect-square h-[60px] w-[60px] items-center justify-center p-0">
												<div className="flex aspect-square h-[50px] w-[50px] items-center justify-center rounded-md border bg-gray-200 dark:bg-gray-700"></div>
											</CardHeader>
											<CardContent className="flex w-full flex-col justify-center py-0 pl-5">
												<div className="flex flex-col justify-between">
													<div className="mb-4 h-2.5 max-w-[200px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
													<div className="h-2 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
												</div>
											</CardContent>
										</Card>
										<Card className="z-0 flex w-full animate-pulse justify-between p-2 delay-1000 ease-in-out">
											<CardHeader className="flex aspect-square h-[60px] w-[60px] items-center justify-center p-0">
												<div className="flex aspect-square h-[50px] w-[50px] items-center justify-center rounded-md border bg-gray-200 dark:bg-gray-700"></div>
											</CardHeader>
											<CardContent className="flex w-full flex-col justify-center py-0 pl-5">
												<div className="flex flex-col justify-between">
													<div className="mb-4 h-2.5 max-w-[200px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
													<div className="h-2 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
												</div>
											</CardContent>
										</Card>
										<Card className="z-0 flex w-full animate-pulse justify-between p-2 delay-1000 ease-in-out">
											<CardHeader className="flex aspect-square h-[60px] w-[60px] items-center justify-center p-0">
												<div className="flex aspect-square h-[50px] w-[50px] items-center justify-center rounded-md border bg-gray-200 dark:bg-gray-700"></div>
											</CardHeader>
											<CardContent className="flex w-full flex-col justify-center py-0 pl-5">
												<div className="flex flex-col justify-between">
													<div className="mb-4 h-2.5 max-w-[200px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
													<div className="h-2 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
												</div>
											</CardContent>
										</Card>
										<Card className="z-0 flex w-full animate-pulse justify-between p-2 delay-1000 ease-in-out">
											<CardHeader className="flex aspect-square h-[60px] w-[60px] items-center justify-center p-0">
												<div className="flex aspect-square h-[50px] w-[50px] items-center justify-center rounded-md border bg-gray-200 dark:bg-gray-700"></div>
											</CardHeader>
											<CardContent className="flex w-full flex-col justify-center py-0 pl-5">
												<div className="flex flex-col justify-between">
													<div className="mb-4 h-2.5 max-w-[200px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
													<div className="h-2 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
												</div>
											</CardContent>
										</Card>
									</>
								)}
							</div>
						</ScrollArea>
					</div>
				</div>

				{/* <div
					className={`${selectedFriend ? 'flex' : 'hidden'} flex w-full items-center justify-center overflow-y-auto rounded-l-none rounded-r-lg bg-slate-100 xl:col-span-3`}
				>
					{selectedFriend ? (
						<Card className="w-full max-w-[400px]">
							<CardHeader className="p-2flex flex-col items-center">
								<Image
									src={selectedFriend.image_url}
									alt={selectedFriend.first_name}
									width={60}
									height={60}
									className="flex items-center justify-center rounded-md"
								/>
								<CardTitle>{`${selectedFriend.first_name} ${selectedFriend.last_name}`}</CardTitle>
								<CardDescription>{`${selectedFriend.email}`}</CardDescription>
							</CardHeader>
							<CardContent>{selectedFriend.id}</CardContent>

							<CardFooter className="flex items-center justify-center">
								<Button
									onClick={() => {
										handleCallUser(selectedFriend.id);
									}}
									className="flex items-center gap-2 bg-green-600"
								>
									<Phone />
								</Button>
							</CardFooter>
						</Card>
					) : (
						'No one selected'
					)}
				</div> */}
			</div>
		</div>
	);
};

export default ConferenceRoom;
