'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import BottomNavigation from '@/components/BottomNavigation';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import Image from 'next/image';
// import { useRouter } from 'next/navigation';

const Room = () => {
	const { getToken } = useAuth();
	// const router = useRouter();
	const [userId, setUserId] = useState<string>('');
	const [friendList, setFriendList] = useState<FriendListResponse[]>([]);
	const [selectedFriend, setSelectedFriend] =
		useState<FriendListResponse | null>(null);

	const handelSendFriend = async () => {
		const token = await getToken();
		if (userId) {
			console.log('UserId==========>', userId);
			try {
				const { data } = await axios.post(
					`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/friend`,
					{
						friendId: userId,
					},
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
					}
				);

				const response = data.data;
				console.log('Respoce Details----->>', response);
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

			const response = data.data;
			setFriendList(response);
			// console.log('Friend List Details----->>', response);
		} catch (error) {
			console.log(error);
		}
	}, [getToken]);

	// const convertTo24Hour = (isoString: Date) => {
	// 	const date = new Date(isoString); // Create a Date object from the ISO string
	// 	const hours = date.getHours().toString().padStart(2, '0'); // Extract hours and pad with '0' if necessary
	// 	const minutes = date.getMinutes().toString().padStart(2, '0'); // Extract minutes and pad with '0' if necessary

	// 	if (isoString) {
	// 		return `${hours}:${minutes}`;
	// 	} else {
	// 		return '';
	// 	}
	// };

	useEffect(() => {
		getFriendList();
	}, [getFriendList]);
	return (
		<div className="grid h-screen w-full bg-primary md:pl-[55px]">
			<Sidebar />
			<div className="flex h-full flex-col">
				<NavBar heading="Room" />
				<main className="flex h-full w-full flex-1 flex-col gap-4 pb-2 pr-2 lg:gap-6">
					<div className="flex flex-1 rounded-lg bg-background shadow-sm">
						<div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-2">
							<Card className="col-span-1 row-span-2 overflow-y-auto rounded-l-lg rounded-r-none bg-slate-100">
								<CardHeader className="flex flex-col gap-3">
									<CardTitle>Search for a Call</CardTitle>
									<CardDescription className="flex gap-7">
										<Input
											onChange={(event) => setUserId(event.target.value)}
											placeholder="Name, email"
										/>
										<Button onClick={() => handelSendFriend()}>
											<Search />
										</Button>
									</CardDescription>
								</CardHeader>
								<CardContent className="w-full">
									<ScrollArea className="h-[70vh] w-full rounded-md border bg-white p-4">
										<div className="flex flex-col gap-3">
											{friendList.length !== 0 ? (
												friendList.map((friend) => (
													<Card
														key={friend.id}
														onClick={() => setSelectedFriend(friend)}
														className="flex w-full justify-between p-2 transition-all duration-200 ease-in-out hover:bg-primary hover:text-white"
													>
														<CardHeader className="flex aspect-square h-[60px] w-[60px] items-center justify-center p-0">
															<Image
																src={friend.image_url}
																alt={friend.first_name}
																width={40}
																height={40}
																className="flex aspect-square h-[50px] w-[50px] items-center justify-center rounded-md border"
															/>
														</CardHeader>
														<CardContent className="flex w-full flex-col justify-center py-0 pl-5">
															<span className="truncate text-lg font-bold">
																{`${friend.first_name} ${friend.last_name}`}
															</span>
															<span className="truncate text-sm">
																{friend.email}
															</span>
														</CardContent>
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
												</>
											)}
										</div>
									</ScrollArea>
								</CardContent>
							</Card>
							<div className="col-span-1 row-span-2 flex items-center justify-center overflow-y-auto rounded-l-none rounded-r-lg bg-slate-100 xl:col-span-3">
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
										</CardHeader>

										<CardFooter className="flex items-center justify-center">
											<Button className="bg-green-600">Call</Button>
										</CardFooter>
									</Card>
								) : (
									'No one selected'
								)}
							</div>
						</div>
					</div>
				</main>
			</div>
			<BottomNavigation />
		</div>
	);
};

export default Room;
