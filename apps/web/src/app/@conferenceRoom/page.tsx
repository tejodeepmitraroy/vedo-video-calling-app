'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	EllipsisVertical,
	Phone,
	Plus,
	Rss,
	Search,
	Trash2,
	UserRoundPlus,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from 'axios';
import { useAuth, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import useGlobalStore from '@/store/useGlobalStore';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'react-toastify';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useRouter } from 'next/navigation';

const ConferenceRoom = () => {
	const { getToken } = useAuth();
	const router = useRouter();
	const { user } = useUser();
	const friendListArray = useGlobalStore((state) => state.friendList);
	const [friendList, setFriendList] = useState<
		FriendListResponse[] | null | undefined
	>();
	const [selectedFriend, setSelectedFriend] =
		useState<FriendListResponse | null>(null);
	const setModifiedFriendList = useGlobalStore((state) => state.setFriendList);

	const { socketOn, socketEmit, socketOff } = useSocket();
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

	const getFriendList = useCallback(async () => {
		const token = await getToken();
		try {
			const { data } = await axios(
				`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/friend`,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const response: FriendListResponse[] = data.data;
			setModifiedFriendList(response);
			setFriendList(response);
			console.log('Friend List Details----->>', response);
		} catch (error) {
			console.log(error);
		}
	}, [getToken, setModifiedFriendList]);

	console.log(friendList);
	console.log('friendListArray', friendListArray);

	const handleCallUser = (userId: string) => {
		socketEmit('callUser', { to: userId, userName: user?.fullName });
	};

	const handleUserIsNotOnline = useCallback(() => {
		toast.warn(`User is Offline`);
	}, []);

	useEffect(() => {
		getFriendList();
	}, [getFriendList]);

	useEffect(() => {
		socketOn('notification:userIsNotOnline', handleUserIsNotOnline);
		return () => {
			socketOff('notification:userIsNotOnline', handleUserIsNotOnline);
		};
	}, [handleUserIsNotOnline, socketOff, socketOn]);

	return (
		<div className="flex flex-1 rounded-lg bg-background shadow-sm">
			<div className="flex w-full gap-2">
				<div className="h-full w-full max-w-[27rem] rounded-lg rounded-l-lg rounded-r-none border bg-card bg-slate-100 text-card-foreground shadow-sm">
					<div className="flex h-32 flex-col gap-2 space-y-1.5 p-6">
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
					<div className="w-full p-6 pt-0">
						<ScrollArea className="h-[42rem] w-full rounded-md border bg-white p-4">
							<div className="flex h-fit flex-col gap-3">
								{friendList ? (
									friendList.map((friend) => (
										<div
											key={friend.id}
											className="group flex w-full justify-between rounded-lg border p-2 transition-all duration-200 ease-in-out hover:bg-primary hover:text-white"
											onClick={() => setSelectedFriend(friend)}
										>
											<div className="flex aspect-square h-[60px] w-[60px] items-center justify-center p-0">
												<Image
													src={friend.image_url}
													alt={friend.first_name}
													width={60}
													height={60}
													className="flex items-center justify-center rounded-md border"
												/>
											</div>
											<div className="flex w-full flex-col justify-center py-0 pl-5">
												<div className="text-lg font-bold">
													{`${friend.first_name} ${friend.last_name}`}
												</div>
												<div className="text-sm">{friend.email}</div>
											</div>
											<div className="flex items-center justify-center p-0">
												{friend.friendShip ? (
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																size={'icon'}
																className="group-hover:bg-background group-hover:text-primary"
															>
																<EllipsisVertical />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent>
															<DropdownMenuLabel>Options</DropdownMenuLabel>
															<DropdownMenuSeparator />
															<DropdownMenuItem className="flex items-center gap-2">
																<Trash2 size={'20'} /> Delete
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												) : (
													<Button
														size={'sm'}
														className="z-30 group-hover:bg-background group-hover:text-primary"
													>
														<UserRoundPlus />
													</Button>
												)}
											</div>
										</div>
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

				<div className="flex w-full items-center justify-center overflow-y-auto rounded-l-none rounded-r-lg bg-slate-100 xl:col-span-3">
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
				</div>
			</div>
		</div>
	);
};

export default ConferenceRoom;
