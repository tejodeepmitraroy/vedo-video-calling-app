'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Rss, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const ConferenceRoom = () => {
	const { getToken, userId } = useAuth();
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
			const roomId = data.data.id;
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

	const handleCallOpenMeeting = ({
		roomId,
		userId: id,
	}: {
		roomId: string;
		userId: string;
	}) => {
		if (id === userId) {
			router.push(`?roomId=${roomId}`);
		} else {
			toast.error('This room is not created by you.But you can ask to join.');
		}
	};

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
					className={`h-full w-full rounded-lg border bg-card bg-slate-100 text-card-foreground shadow-sm md:rounded-lg`}
				>
					<div className="grid w-full grid-cols-3">
						<div className="col-span-3 flex h-32 flex-col gap-2 space-y-1.5 p-3 md:col-span-2 md:p-6 2xl:col-span-1">
							<div className="flex w-full items-center gap-2 md:gap-5">
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
							<div className="flex gap-2 text-sm text-muted-foreground">
								<Input
									onChange={(event) => setRoomId(event.target.value)}
									placeholder="Name, email"
								/>
								<Button
									onClick={() => handleEnterRoom()}
									className="flex gap-2"
								>
									<Search />
									Join
								</Button>
							</div>
						</div>
					</div>

					<div className="w-full pt-0 md:p-5">
						<Table className="">
							<ScrollArea className="h-[60vh] w-full rounded-md bg-white p-0 md:h-[70vh] md:p-4">
								<TableHeader>
									<TableRow>
										<TableHead className="w-[100px]">id</TableHead>
										<TableHead className="hidden sm:table-cell">type</TableHead>
										<TableHead>Title</TableHead>
										<TableHead>createdBy</TableHead>
										<TableHead className="hidden sm:table-cell">
											Start Date
										</TableHead>
										<TableHead className="hidden sm:table-cell">
											Participants
										</TableHead>
										{/* <TableHead className="text-right">Created</TableHead> */}
									</TableRow>
								</TableHeader>
								<TableBody className="w-full">
									{allScheduledRoomsDetails.map((room) => (
										<Dialog key={room.id}>
											<DialogTrigger asChild>
												<TableRow className="text-sm">
													<TableCell className="font-medium">
														{room.id}
													</TableCell>
													<TableCell className="hidden sm:table-cell">
														{room.type}
													</TableCell>
													<TableCell>{room.title}</TableCell>
													<TableCell className="flex items-center gap-2">
														<Avatar className="hidden sm:table-cell">
															<AvatarImage src={room.createdBy.image_url} />
															<AvatarFallback>
																{room.createdBy.first_name}
															</AvatarFallback>
														</Avatar>

														{room.createdBy.first_name}
													</TableCell>
													<TableCell className="hidden sm:table-cell">
														{convertTo24Hour(room.startTime!)}
													</TableCell>
													<TableCell className="hidden items-center sm:flex">
														<Avatar>
															<AvatarImage src={room.createdBy.image_url} />
															<AvatarFallback>
																{room.createdBy.first_name}
															</AvatarFallback>
														</Avatar>
														<Avatar>
															<AvatarImage src={room.createdBy.image_url} />
															<AvatarFallback>
																{room.createdBy.first_name}
															</AvatarFallback>
														</Avatar>
														<Avatar>
															<AvatarImage src={room.createdBy.image_url} />
															<AvatarFallback>
																{room.createdBy.first_name}
															</AvatarFallback>
														</Avatar>
													</TableCell>
												</TableRow>
											</DialogTrigger>
											<DialogContent className="sm:max-w-[425px]">
												<DialogHeader>
													<DialogTitle>Room Details</DialogTitle>
													<DialogDescription>
														Make changes to your profile here. Click save when
														you`&rsquo;`re done.
													</DialogDescription>
												</DialogHeader>
												<DialogClose asChild>
													<Button
														onClick={() =>
															handleCallOpenMeeting({
																roomId: room.id,
																userId: room.createdBy.id,
															})
														}
													>
														Connect room
													</Button>
												</DialogClose>
												<ScrollArea className="h-[50vh]">
													<div className="grid grid-cols-1 gap-4 py-4">
														<div className="grid grid-cols-1 items-center gap-4">
															<Label htmlFor="id" className="">
																Room Id
															</Label>
															<Input
																id="id"
																value={room.id}
																className="col-span-3"
															/>
														</div>
														<div className="grid grid-cols-1 items-center gap-4">
															<Label htmlFor="title" className="">
																Room Type
															</Label>
															<Input
																id="title"
																value={room.type}
																className="col-span-3"
															/>
														</div>
														<div className="grid grid-cols-1 items-center gap-4">
															<Label htmlFor="title" className="">
																Title
															</Label>
															<Input
																id="title"
																value={room.title}
																className="col-span-3"
															/>
														</div>
														<div className="grid grid-cols-1 items-center gap-4">
															<Label htmlFor="createdBy" className="">
																Created By
															</Label>

															<div className="flex items-center gap-3">
																<Avatar>
																	<AvatarImage src={room.createdBy.image_url} />
																	<AvatarFallback>
																		{room.createdBy.first_name}
																	</AvatarFallback>
																</Avatar>
																<Input
																	id="createdBy"
																	value={room.createdBy.first_name}
																	className="col-span-3"
																/>
															</div>
														</div>
														<div className="grid grid-cols-1 items-center gap-4">
															<Label htmlFor="startDate" className="">
																Start Date
															</Label>
															<Input
																id="startDate"
																value={convertTo24Hour(room.startTime!)}
																className="col-span-3"
															/>
														</div>

														<div className="grid grid-cols-1 items-center gap-4">
															<Label htmlFor="participants" className="">
																Participants
															</Label>

															<Input
																id="name"
																value="Pedro Duarte"
																className="col-span-3"
															/>
														</div>
													</div>
												</ScrollArea>
											</DialogContent>
										</Dialog>
									))}
								</TableBody>
							</ScrollArea>
						</Table>
					</div>

					{/* <div className="w-full pt-0 md:p-5">
								<ScrollArea className="h-[25rem] w-full rounded-md border bg-white p-0 md:h-[42rem] md:p-4">
								<div className="flex h-fit flex-col gap-3 p-2">
								{allScheduledRoomsDetails ? (
									allScheduledRoomsDetails.map((room) => (
										<Card
											key={room.id}
											onClick={() =>
												handleCallOpenMeeting({
													roomId: room.roomId,
													userId: room.createdBy.id,
												})
											}
											className="flex w-full cursor-pointer justify-between p-0 transition-all duration-200 ease-in-out hover:bg-primary hover:text-white"
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
														{/* <span className="truncate text-xs">
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
					</div> */}
				</div>
			</div>
		</div>
	);
};

export default ConferenceRoom;
