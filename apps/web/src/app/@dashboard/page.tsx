'use client';
import ScheduleCallForm from '@/components/ScheduleCallForm';
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
import convertISOTo12HourFormat from '@/utils/ISOFormatconverter';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { Laptop, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Dashboard() {
	const [roomId, setRoomId] = useState<string>('');
	const [allScheduledRoomsDetails, setAllScheduledRoomsDetails] = useState<
		RoomDetails[]
	>([]);
	const router = useRouter();
	const { getToken } = useAuth();

	const { userId } = useAuth();

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
			const roomId = data.data.id;
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
		<div className="flex flex-1 rounded-lg bg-background p-4 shadow-sm">
			<div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 xl:grid-rows-2">
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
							Create a Instant Room
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

						<ScheduleCallForm />
					</CardContent>
				</Card>

				<Card className="row-span-2 flex-col overflow-y-auto bg-slate-100">
					<CardHeader>
						<CardTitle>Recent Meetings</CardTitle>
						<CardDescription>meeting & calls logs</CardDescription>
					</CardHeader>
					<CardContent className="w-full">
						<ScrollArea className="h-[68vh] w-full rounded-md border bg-white p-4">
							<div className="flex flex-col gap-3">
								{allScheduledRoomsDetails.splice(0, 5).map((room) => (
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
											{/* <div className="flex h-10 w-10 items-center justify-center rounded-md border group-hover:bg-background">
												<Clock className="h-5 w-5 group-hover:text-black" />
											</div> */}
										</CardHeader>
										<CardContent className="flex w-full justify-start gap-7 p-2 px-10">
											<div className="flex flex-col justify-between">
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
										{/* <CardFooter className="flex items-center justify-center p-2">
											<Image
												src={room.createdBy.image_url}
												alt={room.createdBy.first_name}
												width={60}
												height={60}
												className="flex items-center justify-center rounded-md"
											/>
										</CardFooter> */}
									</Card>
								))}
							</div>
						</ScrollArea>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
