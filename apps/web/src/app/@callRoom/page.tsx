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
	MoveLeft,
	Phone,
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

const CallRoom = () => {
	const { getToken } = useAuth();
	const { user } = useUser();
	const friendListArray = useGlobalStore((state) => state.friendList);
	const [friendList, setFriendList] = useState<
		FriendListResponse[] | null | undefined
	>();
	const [selectedFriend, setSelectedFriend] =
		useState<FriendListResponse | null>(null);
	const setModifiedFriendList = useGlobalStore((state) => state.setFriendList);

	const { socketEmit } = useSocket();
	const [userName, setUserName] = useState<string | undefined>();

	console.log('Call Component++++++++++++');
	////////////////////////////////////////////////////////////////////////////////////////

	const handleSendFriend = async (friendId: string) => {
		const token = await getToken();
		console.log('Friend adding==========>', friendId);
		if (friendId) {
			try {
				toast.info('User Addding');
				const { data } = await axios.post(
					`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/friend`,
					{
						friendId,
					},
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
					}
				);

				const response = data.data;

				toast.success('User Successfully Added');

				console.log('Respoce Details----->>', response);
				return response;
			} catch (error) {
				console.log(error);
			}
		}
	};

	const getUnknownUser = async (value: string) => {
		const token = await getToken();
		console.log('UserId==========>', value);
		if (value.length === 0) {
			return [];
		} else {
			try {
				const { data } = await axios(
					`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user?user=${value}`,
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
					}
				);

				const response: FriendListResponse[] = data.data;

				console.log('friendList=======>>>>>', friendList);

				return response;
			} catch (error) {
				console.log(error);
			}
		}
	};

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

	const handleSearch = async () => {
		console.log('value length', userName!.length, userName);
		if (userName!.length === 0) {
			setFriendList(friendListArray);
		} else {
			const searchedResult = friendList?.filter(
				(item) => item.first_name === userName
			);

			if (searchedResult?.length === 0) {
				const result = await getUnknownUser(userName!);
				console.log('New Result=======>', result);
				setFriendList(result);
			} else {
				setFriendList(searchedResult);
			}
		}
	};

	const handleRemoveFriend = async (friendId: string) => {
		const token = await getToken();
		console.log('Remove Friend==========>', friendId);
		if (friendId) {
			try {
				const { data } = await axios.delete(
					`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/friend?friendId=${friendId}`,
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
					}
				);

				const response = data.data;

				toast.success('friend Successfully Removed');

				console.log('Respoce Details----->>', response);
				return response;
			} catch (error) {
				console.log(error);
			}
		}
	};

	const handleCallUser = (userId: string) => {
		socketEmit('callUser', { to: userId, userName: user?.fullName });
	};

	/////////////////////////////////////////////////////////////////////////

	useEffect(() => {
		getFriendList();
	}, [getFriendList]);

	return (
		<div className="flex flex-1 rounded-lg bg-background shadow-sm">
			<div className="flex w-full gap-2">
				<div
					className={` ${selectedFriend ? 'hidden' : ''} h-full w-full rounded-lg border bg-card bg-slate-100 text-card-foreground shadow-sm md:max-w-[27rem] md:rounded-l-lg md:rounded-r-none`}
				>
					<div className="flex flex-col gap-3 space-y-1.5 p-3 md:h-32 md:p-6">
						<div className="hidden text-2xl font-semibold leading-none tracking-tight md:flex">
							Search for a Call
						</div>
						<div className="flex gap-7 text-sm text-muted-foreground">
							<Input
								onChange={(event) => setUserName(event.target.value)}
								placeholder="Name, email"
							/>
							<Button onClick={() => handleSearch()}>
								<Search />
							</Button>
						</div>
					</div>
					<div className="h-full w-full pt-0 sm:h-fit md:p-5">
						<ScrollArea className="h-[28rem] w-full rounded-md border bg-white p-0 sm:h-[25rem] md:h-[42rem] md:p-4">
							<div className="flex h-fit flex-col gap-3 p-2">
								{friendList ? (
									friendList.map((friend) => (
										<div
											key={friend.id}
											className="group flex w-full justify-between rounded-lg border p-2 transition-all duration-200 ease-in-out hover:bg-primary hover:text-white"
											onClick={() => setSelectedFriend(friend)}
										>
											<div className="flex aspect-square h-[60px] w-fit items-center justify-center p-0 md:w-[60px]">
												<Image
													src={friend.image_url}
													alt={friend.first_name}
													width={60}
													height={60}
													className="flex items-center justify-center rounded-md border"
												/>
											</div>
											<div className="flex w-full flex-col justify-center overflow-x-auto py-0 pl-5">
												<div className="truncate text-lg font-bold">
													{`${friend.first_name} ${friend.last_name}`}
												</div>
												<div className="truncate text-sm">{friend.email}</div>
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
															<DropdownMenuItem
																onClick={() => handleRemoveFriend(friend.id)}
																className="flex items-center gap-2"
															>
																<Trash2 size={'20'} /> Delete
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												) : (
													<Button
														size={'sm'}
														onClick={() => handleSendFriend(friend.id)}
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

				<div
					className={`${selectedFriend ? 'flex' : 'hidden'} w-full items-center justify-center overflow-y-auto rounded-l-none rounded-r-lg bg-slate-100 md:flex xl:col-span-3`}
				>
					{selectedFriend ? (
						<div className="flex flex-col items-center gap-4">
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
							<Button
								onClick={() => setSelectedFriend(null)}
								className="flex w-fit gap-3 md:hidden"
							>
								<MoveLeft />
								Back
							</Button>
						</div>
					) : (
						'No one selected'
					)}
				</div>
			</div>
		</div>
	);
};

export default CallRoom;
