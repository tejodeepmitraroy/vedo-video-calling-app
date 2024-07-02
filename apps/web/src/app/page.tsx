'use client';
import BottomNavigation from '@/components/BottomNavigation';
import NavBar from '@/components/Navbar';

import ScheduleCallForm from '@/components/ScheduleCallForm';
import Sidebar from '@/components/Sidebar';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSocket } from '@/context/SocketContext';
import { useAuth, useUser } from '@clerk/nextjs';
import axios from 'axios';
import { Video, Phone, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Dashboard() {
	const [roomId, setRoomId] = useState<string>('');
	const router = useRouter();
	const { getToken, userId } = useAuth();
	const { socket, socketOn, socketEmit, socketOff } = useSocket();

	const handleInstantCreateCall = async () => {
		const token = await getToken();
		console.log('Token---->', token);

		try {
			const { data } = await toast.promise(
				axios.post(
					`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/call/createInstantCall`,
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
			const roomId = data.data.meetingId;
			const userId = data.data.createdById;

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
						`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/call/${roomId}`,

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
				const response = data.data;

				if (response) {
					const roomId = data.data.meetingId;
					// const userId = data.data.createdById;

					// socketEmit('event:joinRoom', { roomId, userId });

					router.push(`/room/${roomId}`);
				} else {
					toast.error('RoomId Does not Exists');
				}
			} catch (error) {
				console.log(error);
			}
		}
	};

	// const handleJoinRoom = useCallback(
	// 	({ roomId, userId }: { roomId: string; userId: string }) => {
	// 		console.log(`Came form BE RoomId:${roomId}, Email ${userId}`);
	// 		router.push(`/room/${roomId}`);
	// 	},
	// 	[router]
	// );

	// useEffect(() => {
	// 	console.log('socket IO');
	// 	socket?.on('event:joinRoom', handleJoinRoom);
	// 	return () => {
	// 		socket?.off('event:joinRoom', handleJoinRoom);
	// 	};
	// }, [handleJoinRoom, socket]);

	return (
		<div className="grid h-screen w-full md:pl-[60px]">
			<Sidebar />
			<div className="flex flex-col">
				<NavBar heading="Dashboard" />

				<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
					<div className="flex flex-1 items-start justify-start rounded-lg shadow-sm">
						<div className="flex w-full flex-col gap-5 rounded-lg border border-dashed p-5 shadow-sm md:w-auto">
							<div className="flex items-center">
								<h2 className="text-xl font-semibold tracking-tight">
									Quick Settings
								</h2>
							</div>
							<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
							</div>
						</div>
					</div>
				</main>
			</div>
			<BottomNavigation />
		</div>
	);
}
