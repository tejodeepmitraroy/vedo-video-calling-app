'use client';
import BottomNavigation from '@/components/BottomNavigation';
import NavBar from '@/components/Navbar';
import ScheduleCallForm from '@/components/ScheduleCallForm';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { Clock, Phone } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';

export default function Dashboard() {
	const [roomId, setRoomId] = useState<string>('');
	const router = useRouter();
	const { getToken } = useAuth();

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

			router.push(`/room/${roomId}`);
		} catch (error) {
			console.log(error);
		}
	};

	const handleEnterRoom = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const token = await getToken();
		console.log('Enter Room', roomId);

		if (roomId) {
			try {
				const { data } = await toast.promise(
					axios(
						`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/room/${roomId}`,

						{
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer ${token}`,
							},
						}
					),

					{
						pending: 'Wait to create a new Room',
						success: 'Room Found👌',
						error: 'Error happend, New Room Creation rejected 🤯',
					}
				);

				console.log(data);
				// const response = data.data;

				// if (response) {
				// 	const roomId = data.data.meetingId;
				// 	router.push(`/room/${roomId}`);
				// } else {
				// 	toast.error('RoomId Does not Exists');
				// }
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<div className="grid h-screen w-full md:pl-[60px]">
			<Sidebar />
			<div className="flex flex-col">
				<NavBar heading="Dashboard" />

				<main className="mb-14 flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
					<div className="flex flex-1 rounded-lg">
						<div className="grid w-full grid-cols-3 gap-8">
							<Card className="h-fit">
								<CardHeader>
									<CardTitle>Quick Settings</CardTitle>
									<CardDescription>
										Plan a meeting & start a call
									</CardDescription>
								</CardHeader>
								<CardContent className="grid grid-cols-1 gap-5 md:grid-cols-2">
									<form
										onSubmit={(event) => handleEnterRoom(event)}
										className="flex items-center justify-center gap-3 rounded-lg border border-dashed p-2 text-center shadow-sm"
									>
										<Input
											onChange={(event) => setRoomId(event.target.value)}
											value={roomId}
											className="h-14"
											placeholder="Enter Room Code "
										/>
										<Button type="submit" className="h-14">
											Join
										</Button>
									</form>
									<Button
										variant={'outline'}
										onClick={() => handleInstantCreateCall()}
										className="flex items-center justify-center gap-3 border border-dashed p-10 text-center shadow-sm"
									>
										<Phone />
										Create a 1:1 Instant Room
									</Button>

									<ScheduleCallForm />
								</CardContent>
							</Card>

							<Card className="h-fit">
								<CardHeader>
									<CardTitle>Schedule Meetings</CardTitle>
									<CardDescription>Schedule meeting & calls</CardDescription>
								</CardHeader>
								<CardContent className="w-full">
									<Card className="flex w-full justify-between border border-black p-0">
										<CardHeader className="p-2">
											<div className="flex h-10 w-10 items-center justify-center rounded-md border border-black">
												<Clock className="h-5 w-5" />
											</div>
										</CardHeader>
										<CardContent></CardContent>
										<CardFooter>
											<Image
												src={''}
												alt={''}
												className="flex h-10 w-10 items-center justify-center rounded-md border border-black"
											/>
										</CardFooter>
									</Card>
								</CardContent>
							</Card>
						</div>
					</div>
				</main>
			</div>
			<BottomNavigation />
		</div>
	);
}
