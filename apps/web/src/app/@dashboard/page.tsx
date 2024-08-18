'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import convertISOTo12HourFormat from '@/utils/ISOFormatconverter';
import { useAuth, useUser } from '@clerk/nextjs';
import axios from 'axios';
import { Laptop, Phone } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Dashboard() {
	const [roomId, setRoomId] = useState<string>('');
	const [allScheduledRoomsDetails, setAllScheduledRoomsDetails] = useState<
		RoomDetails[] | null
	>(null);
	const router = useRouter();
	const { getToken, userId } = useAuth();

	const { user } = useUser();

	console.log('Dashboard Component++++++++++++');

	const handleInstantCreateCall = async () => {
		const token = await getToken();
		// console.log('Token---->', token);

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

			const response: RoomDetails = data.data;
			const roomId = response.id;

			// const userId = data.data.createdById;

			router.push(`?roomId=${roomId}`);
		} catch (error) {
			console.log(error);
		}
	};

	const handleEnterRoom = async () => {
		const token = await getToken();
		console.log('Enter Room', roomId);
		if (roomId) {
			try {
				const { data } = await toast.promise(
					axios.post(
						`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/room?roomId=${roomId}`,
						{},
						{
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer ${token}`,
							},
						}
					),

					{
						pending: 'Finding Room',
						success: 'Connecting👌',
						error: `Error happend, We don't find the room 🤯`,
					}
				);

				// const { data } = await axios<ApiResponse>(
				// 	`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/room?roomId=${roomId}`,
				// 	{
				// 		headers: {
				// 			'Content-Type': 'application/json',
				// 			Authorization: `Bearer ${token}`,
				// 		},
				// 	}
				// );

				console.log(data);

				router.push(`?roomId=${roomId}`);
			} catch (error) {
				console.log(error);
			}
		}
	};

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

	useEffect(() => {
		getRoomDetails();
	}, [getRoomDetails]);

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
			toast('This room is not created by you.But you can ask to join.');
			router.push(`?roomId=${roomId}`);
		}
	};

	return (
		<ScrollArea className="flex h-full w-full md:flex-1">
			<div className="mx-auto grid h-full w-full max-w-7xl grid-flow-col grid-cols-1 gap-5 overflow-y-auto p-4 md:grid-cols-2 xl:grid-rows-3 2xl:grid-cols-2">
				<Card className="hidden flex-col bg-slate-200 md:flex">
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
						<CardDescription>Plan a meeting & start a call</CardDescription>
					</CardHeader>
					<CardContent className="grid grid-cols-1 gap-5 xl:grid-cols-2">
						<Button
							variant={'outline'}
							onClick={() => handleInstantCreateCall()}
							className="flex w-full items-center justify-center gap-3 border bg-primary py-10 text-center text-base text-background shadow-sm hover:text-primary"
						>
							<Laptop />
							Create a Room
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="flex w-full items-center justify-center gap-3 border bg-primary py-10 text-center text-base text-background shadow-sm hover:text-primary"
								>
									<Phone />
									Join Room
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="space-y-3 p-3">
								<Input
									onChange={(event) => setRoomId(event.target.value)}
									value={roomId}
									className="w-full"
									placeholder="Enter Room Code "
								/>

								<DropdownMenuItem className="p-0" asChild>
									<Button
										onClick={() => handleEnterRoom()}
										type="submit"
										className="w-full"
									>
										Join
									</Button>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						{/* <ScheduleCallForm /> */}
					</CardContent>
				</Card>

				{user ? (
					<Card className="row-span-2 hidden h-fit flex-col bg-slate-100 md:flex">
						<CardHeader>
							<div className="grid w-full grid-cols-4 gap-2">
								<div className="col-span-1">
									<Image
										src={user ? user.imageUrl : ''}
										className="aspect-square w-full rounded-lg border-2 border-black"
										width={80}
										height={80}
										alt={user?.fullName ? user.fullName : 'name'}
									/>
								</div>
								<div className="col-span-3 flex flex-col items-start justify-center pl-10">
									<span className="text-2xl">Hello</span>
									<CardTitle className="flex">{user?.fullName}</CardTitle>
									<CardDescription>
										Check these stats below in case you have missed something
									</CardDescription>
								</div>
							</div>
						</CardHeader>

						<CardContent className="">
							<Separator className="bg-black" />

							<div className="flex flex-col gap-4 p-5">
								<div className="flex w-full justify-between">
									<div className="flex flex-col">
										<span className="font-bold">Created Rooms</span>
										<span className="text-sm font-medium">
											Total Room created
										</span>
									</div>
									<div className="flex items-center font-bold">
										{allScheduledRoomsDetails ? (
											allScheduledRoomsDetails.map(
												(room) => room.createdById === userId
											).length
										) : (
											<>0</>
										)}
									</div>
								</div>
								<div className="flex w-full justify-between">
									<div className="flex flex-col">
										<span className="font-bold">Room Visited</span>
										<span className="text-sm font-medium">
											Total Room you visited
										</span>
									</div>
									<div className="flex items-center font-bold">
										{allScheduledRoomsDetails ? (
											allScheduledRoomsDetails.map((room) =>
												room.participants.map((user) => user.id === userId)
											).length
										) : (
											<>0</>
										)}
									</div>
								</div>
							</div>
							<Separator className="bg-black" />
						</CardContent>
					</Card>
				) : (
					<Card className="row-span-2 hidden h-fit animate-pulse flex-col bg-slate-100 md:flex">
						<CardHeader>
							<div className="grid w-full grid-cols-4 gap-2">
								<div className="col-span-1">
									<div className="aspect-square w-full animate-pulse rounded-lg border-2 border-black" />
								</div>
								<div className="col-span-3 flex flex-col items-start justify-center pl-10">
									<span className="mt-3 flex h-4 w-[20%] rounded-lg bg-slate-300"></span>
									<CardTitle className="mt-5 flex h-3 w-[50%] rounded-lg bg-slate-300"></CardTitle>
									<CardDescription className="mt-3 flex h-3 w-full rounded-lg bg-slate-300"></CardDescription>
									<CardDescription className="mt-1 flex h-3 w-full rounded-lg bg-slate-300"></CardDescription>
								</div>
							</div>
						</CardHeader>

						<CardContent className="">
							<Separator className="bg-black" />

							<div className="flex flex-col gap-4 p-5">
								<div className="flex w-full justify-between">
									<div className="flex w-full flex-col">
										<span className="flex h-3 w-[30%] rounded-lg bg-slate-300"></span>
										<span className="mt-2 flex h-3 w-[25%] rounded-lg bg-slate-300"></span>
									</div>
									<div className="flex items-center">
										<span className="mt-2 flex h-3 w-[10%] rounded-lg bg-slate-500"></span>
									</div>
								</div>
								<div className="flex w-full justify-between">
									<div className="flex w-full flex-col">
										<span className="flex h-3 w-[30%] rounded-lg bg-slate-300"></span>
										<span className="mt-2 flex h-3 w-[25%] rounded-lg bg-slate-300"></span>
									</div>
									<div className="flex items-center">
										<span className="mt-2 flex h-3 w-[10%] rounded-lg bg-slate-500"></span>
									</div>
								</div>
							</div>
							<Separator className="bg-black" />
						</CardContent>
					</Card>
				)}

				<Card className="row-span-3 flex-col overflow-y-auto bg-slate-100">
					<CardHeader className="w-full p-4 pb-3 md:p-6">
						<CardTitle>Recent Meetings</CardTitle>
						<CardDescription>meeting & calls logs</CardDescription>
					</CardHeader>
					<CardContent className="w-full border p-0 md:p-6 md:pt-0">
						<ScrollArea className="h-[65vh] w-full rounded-md border bg-white p-4 md:h-[70vh]">
							<div className="flex flex-col gap-3">
								{allScheduledRoomsDetails ? (
									allScheduledRoomsDetails.length === 0 ? (
										<div className="flex w-full justify-center">
											<span>No Data Existed</span>
										</div>
									) : (
										allScheduledRoomsDetails.splice(0, 5).map((room) => (
											<Card
												key={room.id}
												onClick={() =>
													handleCallOpenMeeting({
														roomId: room.id,
														userId: room.createdBy.id,
													})
												}
												className="group flex w-full cursor-pointer justify-between p-0 transition-all duration-200 ease-in-out hover:bg-primary hover:text-white"
											>
												<CardHeader className="p-2">
													<Avatar>
														<AvatarImage src={room.createdBy.image_url} />
														<AvatarFallback>
															{room.createdBy.first_name}
														</AvatarFallback>
													</Avatar>
												</CardHeader>
												<CardContent className="flex w-full justify-start gap-7 p-2 lg:px-10">
													<div className="flex flex-col justify-between text-sm">
														<span className="font-semibold">
															{convertISOTo12HourFormat(room.startTime!).time}
														</span>
														<span className="text-xs">
															{convertISOTo12HourFormat(room.startTime!).date}
														</span>
													</div>
													<div className="flex flex-col justify-between">
														<span className="truncate font-semibold">
															{room.title}
														</span>
														<span className="truncate text-xs">
															{`${room.createdBy.first_name} ${room.createdBy.last_name}`}
														</span>
													</div>
												</CardContent>
											</Card>
										))
									)
								) : (
									<div className="flex animate-pulse flex-col gap-3">
										<Card className="group flex w-full cursor-pointer justify-between p-0 transition-all duration-200 ease-in-out hover:bg-primary hover:text-white">
											<CardHeader className="p-2">
												<Avatar>
													<AvatarImage src={''} />
													<AvatarFallback></AvatarFallback>
												</Avatar>
											</CardHeader>
											<CardContent className="flex w-full justify-start gap-7 p-2 lg:px-10">
												<div className="flex flex-col justify-evenly gap-1">
													<div className="w-30 flex h-2 rounded-lg bg-slate-400"></div>
													<div className="flex h-2 w-20 rounded-lg bg-slate-400"></div>
												</div>
												<div className="flex w-full flex-col justify-evenly">
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
												</div>
											</CardContent>
										</Card>
										<Card className="group flex w-full cursor-pointer justify-between p-0 transition-all duration-200 ease-in-out hover:bg-primary hover:text-white">
											<CardHeader className="p-2">
												<Avatar>
													<AvatarImage src={''} />
													<AvatarFallback></AvatarFallback>
												</Avatar>
											</CardHeader>
											<CardContent className="flex w-full justify-start gap-7 p-2 lg:px-10">
												<div className="flex flex-col justify-evenly gap-1">
													<div className="w-30 flex h-2 rounded-lg bg-slate-400"></div>
													<div className="flex h-2 w-20 rounded-lg bg-slate-400"></div>
												</div>
												<div className="flex w-full flex-col justify-evenly">
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
												</div>
											</CardContent>
										</Card>
										<Card className="group flex w-full cursor-pointer justify-between p-0 transition-all duration-200 ease-in-out hover:bg-primary hover:text-white">
											<CardHeader className="p-2">
												<Avatar>
													<AvatarImage src={''} />
													<AvatarFallback></AvatarFallback>
												</Avatar>
											</CardHeader>
											<CardContent className="flex w-full justify-start gap-7 p-2 lg:px-10">
												<div className="flex flex-col justify-evenly gap-1">
													<div className="w-30 flex h-2 rounded-lg bg-slate-400"></div>
													<div className="flex h-2 w-20 rounded-lg bg-slate-400"></div>
												</div>
												<div className="flex w-full flex-col justify-evenly">
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
												</div>
											</CardContent>
										</Card>
										<Card className="group flex w-full cursor-pointer justify-between p-0 transition-all duration-200 ease-in-out hover:bg-primary hover:text-white">
											<CardHeader className="p-2">
												<Avatar>
													<AvatarImage src={''} />
													<AvatarFallback></AvatarFallback>
												</Avatar>
											</CardHeader>
											<CardContent className="flex w-full justify-start gap-7 p-2 lg:px-10">
												<div className="flex flex-col justify-evenly gap-1">
													<div className="w-30 flex h-2 rounded-lg bg-slate-400"></div>
													<div className="flex h-2 w-20 rounded-lg bg-slate-400"></div>
												</div>
												<div className="flex w-full flex-col justify-evenly">
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
												</div>
											</CardContent>
										</Card>
										<Card className="group flex w-full cursor-pointer justify-between p-0 transition-all duration-200 ease-in-out hover:bg-primary hover:text-white">
											<CardHeader className="p-2">
												<Avatar>
													<AvatarImage src={''} />
													<AvatarFallback></AvatarFallback>
												</Avatar>
											</CardHeader>
											<CardContent className="flex w-full justify-start gap-7 p-2 lg:px-10">
												<div className="flex flex-col justify-evenly gap-1">
													<div className="w-30 flex h-2 rounded-lg bg-slate-400"></div>
													<div className="flex h-2 w-20 rounded-lg bg-slate-400"></div>
												</div>
												<div className="flex w-full flex-col justify-evenly">
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
												</div>
											</CardContent>
										</Card>
										<Card className="group flex w-full cursor-pointer justify-between p-0 transition-all duration-200 ease-in-out hover:bg-primary hover:text-white">
											<CardHeader className="p-2">
												<Avatar>
													<AvatarImage src={''} />
													<AvatarFallback></AvatarFallback>
												</Avatar>
											</CardHeader>
											<CardContent className="flex w-full justify-start gap-7 p-2 lg:px-10">
												<div className="flex flex-col justify-evenly gap-1">
													<div className="w-30 flex h-2 rounded-lg bg-slate-400"></div>
													<div className="flex h-2 w-20 rounded-lg bg-slate-400"></div>
												</div>
												<div className="flex w-full flex-col justify-evenly">
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
												</div>
											</CardContent>
										</Card>
									</div>
								)}
							</div>
						</ScrollArea>
					</CardContent>
				</Card>
			</div>
		</ScrollArea>
	);
}

{
	/* <div className="grid h-[80%] w-full grid-flow-col grid-cols-1 gap-8 overflow-y-auto md:grid-cols-2 xl:grid-rows-3 2xl:grid-cols-3">
				<Card className="hidden h-fit flex-col bg-slate-200 md:flex">
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
						<CardDescription>Plan a meeting & start a call</CardDescription>
					</CardHeader>
					<CardContent className="grid grid-cols-1 gap-5 xl:grid-cols-2">
						<Button
							variant={'outline'}
							onClick={() => handleInstantCreateCall()}
							className="flex w-full items-center justify-center gap-3 border bg-primary py-10 text-center text-base text-background shadow-sm hover:text-primary"
						>
							<Laptop />
							Create a Room
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="flex w-full items-center justify-center gap-3 border bg-primary py-10 text-center text-base text-background shadow-sm hover:text-primary"
								>
									<Phone />
									Join Room
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="space-y-3 p-3">
								<Input
									onChange={(event) => setRoomId(event.target.value)}
									value={roomId}
									className="w-full"
									placeholder="Enter Room Code "
								/>

								<DropdownMenuItem className="p-0" asChild>
									<Button
										onClick={() => handleEnterRoom()}
										type="submit"
										className="w-full"
									>
										Join
									</Button>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						{/* <ScheduleCallForm /> 
					</CardContent>
				</Card>

				{user ? (
					<Card className="row-span-2 hidden h-fit flex-col bg-slate-100 md:flex">
						<CardHeader>
							<div className="grid w-full grid-cols-4 gap-2">
								<div className="col-span-1">
									<Image
										src={user ? user.imageUrl : ''}
										className="aspect-square w-full rounded-lg border-2 border-black"
										width={80}
										height={80}
										alt={user?.fullName ? user.fullName : 'name'}
									/>
								</div>
								<div className="col-span-3 flex flex-col items-start justify-center pl-10">
									<span className="text-2xl">Hello</span>
									<CardTitle className="flex">{user?.fullName}</CardTitle>
									<CardDescription>
										Check these stats below in case you have missed something
									</CardDescription>
								</div>
							</div>
						</CardHeader>

						<CardContent className="">
							<Separator className="bg-black" />

							<div className="flex flex-col gap-4 p-5">
								<div className="flex w-full justify-between">
									<div className="flex flex-col">
										<span className="font-bold">Created Rooms</span>
										<span className="text-sm font-medium">
											Total Room created
										</span>
									</div>
									<div className="flex items-center font-bold">
										{allScheduledRoomsDetails ? (
											allScheduledRoomsDetails.map(
												(room) => room.createdById === userId
											).length
										) : (
											<>0</>
										)}
									</div>
								</div>
								<div className="flex w-full justify-between">
									<div className="flex flex-col">
										<span className="font-bold">Room Visited</span>
										<span className="text-sm font-medium">
											Total Room you visited
										</span>
									</div>
									<div className="flex items-center font-bold">
										{allScheduledRoomsDetails ? (
											allScheduledRoomsDetails.map((room) =>
												room.participants.map((user) => user.id === userId)
											).length
										) : (
											<>0</>
										)}
									</div>
								</div>
							</div>
							<Separator className="bg-black" />
						</CardContent>
					</Card>
				) : (
					<Card className="row-span-2 hidden h-fit animate-pulse flex-col bg-slate-100 md:flex">
						<CardHeader>
							<div className="grid w-full grid-cols-4 gap-2">
								<div className="col-span-1">
									<div className="aspect-square w-full animate-pulse rounded-lg border-2 border-black" />
								</div>
								<div className="col-span-3 flex flex-col items-start justify-center pl-10">
									<span className="mt-3 flex h-4 w-[20%] rounded-lg bg-slate-300"></span>
									<CardTitle className="mt-5 flex h-3 w-[50%] rounded-lg bg-slate-300"></CardTitle>
									<CardDescription className="mt-3 flex h-3 w-full rounded-lg bg-slate-300"></CardDescription>
									<CardDescription className="mt-1 flex h-3 w-full rounded-lg bg-slate-300"></CardDescription>
								</div>
							</div>
						</CardHeader>

						<CardContent className="">
							<Separator className="bg-black" />

							<div className="flex flex-col gap-4 p-5">
								<div className="flex w-full justify-between">
									<div className="flex w-full flex-col">
										<span className="flex h-3 w-[30%] rounded-lg bg-slate-300"></span>
										<span className="mt-2 flex h-3 w-[25%] rounded-lg bg-slate-300"></span>
									</div>
									<div className="flex items-center">
										<span className="mt-2 flex h-3 w-[10%] rounded-lg bg-slate-500"></span>
									</div>
								</div>
								<div className="flex w-full justify-between">
									<div className="flex w-full flex-col">
										<span className="flex h-3 w-[30%] rounded-lg bg-slate-300"></span>
										<span className="mt-2 flex h-3 w-[25%] rounded-lg bg-slate-300"></span>
									</div>
									<div className="flex items-center">
										<span className="mt-2 flex h-3 w-[10%] rounded-lg bg-slate-500"></span>
									</div>
								</div>
							</div>
							<Separator className="bg-black" />
						</CardContent>
					</Card>
				)}

				<Card className="row-span-3 flex-col overflow-y-auto bg-slate-100">
					<CardHeader className="w-full p-4 pb-3 md:p-6">
						<CardTitle>Recent Meetings</CardTitle>
						<CardDescription>meeting & calls logs</CardDescription>
					</CardHeader>
					<CardContent className="w-full border  p-0 md:p-6 md:pt-0">
						<ScrollArea className="h-[65vh] w-full rounded-md border bg-white p-4 md:h-[70vh]">
							<div className="flex flex-col gap-3">
								{allScheduledRoomsDetails ? (
									allScheduledRoomsDetails.length === 0 ? (
										<div className="flex w-full justify-center">
											<span>No Data Existed</span>
										</div>
									) : (
										allScheduledRoomsDetails.splice(0, 5).map((room) => (
											<Card
												key={room.id}
												onClick={() =>
													handleCallOpenMeeting({
														roomId: room.id,
														userId: room.createdBy.id,
													})
												}
												className="group flex w-full cursor-pointer justify-between p-0 transition-all duration-200 ease-in-out hover:bg-primary hover:text-white"
											>
												<CardHeader className="p-2">
													<Avatar>
														<AvatarImage src={room.createdBy.image_url} />
														<AvatarFallback>
															{room.createdBy.first_name}
														</AvatarFallback>
													</Avatar>
												</CardHeader>
												<CardContent className="flex w-full justify-start gap-7 p-2 lg:px-10">
													<div className="flex flex-col justify-between text-sm">
														<span className="font-semibold">
															{convertISOTo12HourFormat(room.startTime!).time}
														</span>
														<span className="text-xs">
															{convertISOTo12HourFormat(room.startTime!).date}
														</span>
													</div>
													<div className="flex flex-col justify-between">
														<span className="truncate font-semibold">
															{room.title}
														</span>
														<span className="truncate text-xs">
															{`${room.createdBy.first_name} ${room.createdBy.last_name}`}
														</span>
													</div>
												</CardContent>
											</Card>
										))
									)
								) : (
									<div className="flex animate-pulse flex-col gap-3">
										<Card className="group flex w-full cursor-pointer justify-between p-0 transition-all duration-200 ease-in-out hover:bg-primary hover:text-white">
											<CardHeader className="p-2">
												<Avatar>
													<AvatarImage src={''} />
													<AvatarFallback></AvatarFallback>
												</Avatar>
											</CardHeader>
											<CardContent className="flex w-full justify-start gap-7 p-2 lg:px-10">
												<div className="flex flex-col justify-evenly gap-1">
													<div className="w-30 flex h-2 rounded-lg bg-slate-400"></div>
													<div className="flex h-2 w-20 rounded-lg bg-slate-400"></div>
												</div>
												<div className="flex w-full flex-col justify-evenly">
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
												</div>
											</CardContent>
										</Card>
										<Card className="group flex w-full cursor-pointer justify-between p-0 transition-all duration-200 ease-in-out hover:bg-primary hover:text-white">
											<CardHeader className="p-2">
												<Avatar>
													<AvatarImage src={''} />
													<AvatarFallback></AvatarFallback>
												</Avatar>
											</CardHeader>
											<CardContent className="flex w-full justify-start gap-7 p-2 lg:px-10">
												<div className="flex flex-col justify-evenly gap-1">
													<div className="w-30 flex h-2 rounded-lg bg-slate-400"></div>
													<div className="flex h-2 w-20 rounded-lg bg-slate-400"></div>
												</div>
												<div className="flex w-full flex-col justify-evenly">
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
												</div>
											</CardContent>
										</Card>
										<Card className="group flex w-full cursor-pointer justify-between p-0 transition-all duration-200 ease-in-out hover:bg-primary hover:text-white">
											<CardHeader className="p-2">
												<Avatar>
													<AvatarImage src={''} />
													<AvatarFallback></AvatarFallback>
												</Avatar>
											</CardHeader>
											<CardContent className="flex w-full justify-start gap-7 p-2 lg:px-10">
												<div className="flex flex-col justify-evenly gap-1">
													<div className="w-30 flex h-2 rounded-lg bg-slate-400"></div>
													<div className="flex h-2 w-20 rounded-lg bg-slate-400"></div>
												</div>
												<div className="flex w-full flex-col justify-evenly">
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
												</div>
											</CardContent>
										</Card>
										<Card className="group flex w-full cursor-pointer justify-between p-0 transition-all duration-200 ease-in-out hover:bg-primary hover:text-white">
											<CardHeader className="p-2">
												<Avatar>
													<AvatarImage src={''} />
													<AvatarFallback></AvatarFallback>
												</Avatar>
											</CardHeader>
											<CardContent className="flex w-full justify-start gap-7 p-2 lg:px-10">
												<div className="flex flex-col justify-evenly gap-1">
													<div className="w-30 flex h-2 rounded-lg bg-slate-400"></div>
													<div className="flex h-2 w-20 rounded-lg bg-slate-400"></div>
												</div>
												<div className="flex w-full flex-col justify-evenly">
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
												</div>
											</CardContent>
										</Card>
										<Card className="group flex w-full cursor-pointer justify-between p-0 transition-all duration-200 ease-in-out hover:bg-primary hover:text-white">
											<CardHeader className="p-2">
												<Avatar>
													<AvatarImage src={''} />
													<AvatarFallback></AvatarFallback>
												</Avatar>
											</CardHeader>
											<CardContent className="flex w-full justify-start gap-7 p-2 lg:px-10">
												<div className="flex flex-col justify-evenly gap-1">
													<div className="w-30 flex h-2 rounded-lg bg-slate-400"></div>
													<div className="flex h-2 w-20 rounded-lg bg-slate-400"></div>
												</div>
												<div className="flex w-full flex-col justify-evenly">
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
												</div>
											</CardContent>
										</Card>
										<Card className="group flex w-full cursor-pointer justify-between p-0 transition-all duration-200 ease-in-out hover:bg-primary hover:text-white">
											<CardHeader className="p-2">
												<Avatar>
													<AvatarImage src={''} />
													<AvatarFallback></AvatarFallback>
												</Avatar>
											</CardHeader>
											<CardContent className="flex w-full justify-start gap-7 p-2 lg:px-10">
												<div className="flex flex-col justify-evenly gap-1">
													<div className="w-30 flex h-2 rounded-lg bg-slate-400"></div>
													<div className="flex h-2 w-20 rounded-lg bg-slate-400"></div>
												</div>
												<div className="flex w-full flex-col justify-evenly">
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
													<div className="w-30 flex h-3 rounded-lg bg-slate-400"></div>
												</div>
											</CardContent>
										</Card>
									</div>
								)}
							</div>
						</ScrollArea>
					</CardContent>
				</Card>
			</div> */
}
// </div>
