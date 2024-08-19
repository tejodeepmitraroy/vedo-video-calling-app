'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'react-toastify';
// import { useRouter } from 'next/navigation';

import { DataTable } from './data-table';
import { columns } from './columns';

const ConferenceRoom = () => {
	const { getToken } = useAuth();
	// const router = useRouter();

	// const friendListArray = useGlobalStore((state) => state.friendList);
	// const [friendList, setFriendList] = useState<
	// 	FriendListResponse[] | null | undefined
	// >();
	const [allScheduledRoomsDetails, setAllScheduledRoomsDetails] = useState<
		RoomDetails[]
	>([]);

	const { socketOn, socketOff } = useSocket();
	// const [roomId, setRoomId] = useState<string>('');

	//////////////////////////////////////////////////////////////////////////////////////////

	// const handleInstantCreateCall = async () => {
	// 	const token = await getToken();
	// 	console.log('Token---->', token);

	// 	try {
	// 		const { data } = await toast.promise(
	// 			axios.post(
	// 				`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/room`,
	// 				{},
	// 				{
	// 					headers: {
	// 						'Content-Type': 'application/json',
	// 						Authorization: `Bearer ${token}`,
	// 					},
	// 				}
	// 			),

	// 			{
	// 				pending: 'Wait to create a new Room',
	// 				success: 'New Room Created👌',
	// 				error: 'Error happend, New Room Creation rejected 🤯',
	// 			}
	// 		);

	// 		console.log(data.data);
	// 		const roomId = data.data.id;
	// 		// const userId = data.data.createdById;

	// 		router.push(`?roomId=${roomId}`);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	//////////////////////////////////////////////////////////////////////////////////////////
	// const handleEnterRoom = async () => {
	// 	const token = await getToken();
	// 	console.log('Enter Room', roomId);
	// 	if (roomId) {
	// 		try {
	// 			const { data } = await axios<ApiResponse>(
	// 				`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/room?roomId=${roomId}`,
	// 				{
	// 					headers: {
	// 						'Content-Type': 'application/json',
	// 						Authorization: `Bearer ${token}`,
	// 					},
	// 				}
	// 			);

	// 			console.log(data);

	// 			router.push(`?roomId=${roomId}`);
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	}
	// };

	///////////////////////////////////////////////////////////////////////////////////////////

	const getAllRoomDetails = useCallback(async () => {
		const token = await getToken();

		try {
			const { data } = await axios(
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

	// const handleCallOpenMeeting = ({
	// 	roomId,
	// 	userId: id,
	// }: {
	// 	roomId: string;
	// 	userId: string;
	// }) => {
	// 	if (id === userId) {
	// 		router.push(`?roomId=${roomId}`);
	// 	} else {
	// 		toast('This room is not created by you.But you can ask to join.');
	// 		router.push(`?roomId=${roomId}`);
	// 	}
	// };

	const handleUserIsNotOnline = useCallback(() => {
		toast.warn(`User is Offline`);
	}, []);

	useEffect(() => {
		getAllRoomDetails();
	}, [getAllRoomDetails]);

	useEffect(() => {
		socketOn('notification:userIsNotOnline', handleUserIsNotOnline);
		return () => {
			socketOff('notification:userIsNotOnline', handleUserIsNotOnline);
		};
	}, [handleUserIsNotOnline, socketOff, socketOn]);

	return (
		<ScrollArea className="flex h-full w-full px-4 md:flex-1">
			<div className="m-4 mx-auto flex h-full w-full max-w-7xl flex-col gap-5 rounded-lg bg-card bg-slate-100 p-5 text-card-foreground">
				{/* <div className="flex w-full gap-4">
					<div className="flex gap-2 text-sm text-muted-foreground">
						<Input
							onChange={(event) => setRoomId(event.target.value)}
							placeholder="Enter Room Code"
						/>
						<Button onClick={() => handleEnterRoom()} className="flex gap-2">
							<Search />
							Join
						</Button>
					</div>
					<Button
						onClick={() => handleInstantCreateCall()}
						className="flex gap-2"
					>
						<Plus />
						Instant Room
					</Button>
				</div> */}

				<DataTable columns={columns} data={allScheduledRoomsDetails} />

				{/* <Table className="w-full">
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
							</TableRow>
						</TableHeader>
						{allScheduledRoomsDetails.length === 0 ? (
							<TableCaption>No Data Existed</TableCaption>
						) : (
							allScheduledRoomsDetails.map((room) => (
								<TableBody key={room.id} className="w-full">
									<Dialog>
										<DialogTrigger asChild>
											<TableRow className="border-b-3 border-black text-sm">
												<TableCell className="font-medium">{room.id}</TableCell>
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
													<div className="flex flex-col gap-2">
														<span>
															{convertISOTo12HourFormat(room.startTime!).time}
														</span>
														<span>
															{convertISOTo12HourFormat(room.startTime!).date}
														</span>
													</div>
												</TableCell>
												<TableCell className="hidden items-center sm:flex">
													<AnimatedTooltip
														items={room.participants.map((item, index) => {
															return {
																id: index,
																name: item.first_name,
																image: item.image_url,
																designation: item.email,
															};
														})}
													/>
													{/* <TooltipProvider>
																{room.participants.map((item) => (
																	<Tooltip key={item.id}>
																		<TooltipTrigger>
																			<Avatar>
																				<AvatarImage src={item.image_url} />
																				<AvatarFallback>
																					{item.first_name}
																				</AvatarFallback>
																			</Avatar>
																		</TooltipTrigger>
																		<TooltipContent>
																			<p>{item.first_name}</p>
																		</TooltipContent>
																	</Tooltip>
																))}
															</TooltipProvider> 
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
																value={`${room.createdBy.first_name} ${room.createdBy.last_name}`}
																className="col-span-3"
															/>
														</div>
													</div>
													<div className="grid grid-cols-1 items-center gap-4">
														<Label htmlFor="startDate" className="">
															Start time
														</Label>
														<Input
															id="startDate"
															value={
																convertISOTo12HourFormat(room.startTime!).time
															}
															className="col-span-3"
														/>
													</div>
													<div className="grid grid-cols-1 items-center gap-4">
														<Label htmlFor="startDate" className="">
															Start Date
														</Label>
														<Input
															id="startDate"
															value={
																convertISOTo12HourFormat(room.startTime!).date
															}
															className="col-span-3"
														/>
													</div>

													<div className="grid grid-cols-1 items-center gap-4">
														<Label htmlFor="participants" className="">
															Participants
														</Label>

														{room.participants.map((item) => (
															<div
																className="flex items-center gap-3"
																key={item.id}
															>
																<Avatar>
																	<AvatarImage src={item.image_url} />
																	<AvatarFallback>
																		{item.first_name}
																	</AvatarFallback>
																</Avatar>
																<Input
																	id="startDate"
																	value={`${item.first_name} ${item.last_name}`}
																	className="col-span-3"
																/>
															</div>
														))}
													</div>
												</div>
											</ScrollArea>
										</DialogContent>
									</Dialog>
								</TableBody>
							))
						)}
					</ScrollArea>
				</Table> */}
			</div>
		</ScrollArea>
	);
};

export default ConferenceRoom;
