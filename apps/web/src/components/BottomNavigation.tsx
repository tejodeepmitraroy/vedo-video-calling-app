import {
	Home,
	Laptop,
	// Phone
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './ui/button';
import UserProfile from './UserProfile';
import useScreenStateStore from '@/store/useScreenStateStore';
import useGlobalStore from '@/store/useGlobalStore';
import { Input } from './ui/input';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';

import { Separator } from './ui/separator';
import useRoomStore from '@/store/useRoomStore';
import Link from 'next/link';

const BottomNavigation = () => {
	const [roomId, setRoomId] = useState<string>('');
	const setCurrentState = useScreenStateStore(
		(state) => state.setCurrentScreen
	);
	const currentState = useScreenStateStore((state) => state.currentScreen);
	const roomState = useRoomStore((state) => state.roomState);

	const { getToken } = useAuth();
	const router = useRouter();

	const onLineStatus = useGlobalStore((state) => state.onLineStatus);

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

			router.replace(`?roomId=${roomId}`);
			// router.refresh()
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
	return (
		<div
			className={`${roomState === 'meetingRoom' ? 'hidden' : 'fixed'} fixed bottom-0 left-0 z-50 h-16 w-full border-t border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700 md:hidden`}
		>
			<div className="mx-auto grid h-full max-w-lg grid-cols-5 font-medium">
				<Link
					href={'/'}
					className="group flex items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
				>
					<button
						type="button"
						className="inline-flex flex-col items-center justify-center"
						onClick={() => setCurrentState('Dashboard')}
					>
						<Home
							className={`${currentState === 'Dashboard' ? 'mb-1 h-6 w-12 rounded-md bg-primary text-background' : 'mb-1 h-6 w-6 text-gray-500 group-hover:text-primary dark:text-gray-400 dark:group-hover:text-blue-500'} `}
						/>
						<span
							className={` ${currentState === 'Dashboard' ? 'font-bold' : ''} text-sm text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500`}
						>
							Home
						</span>
					</button>
				</Link>
				{/* <Link
					href={'/'}
					className="group flex items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
				>
					<button
						type="button"
						className="inline-flex flex-col items-center justify-center"
						onClick={() => setCurrentState('Call')}
					>
						<Phone
							className={`${currentState === 'Call' ? 'mb-1 h-6 w-12 rounded-md bg-primary text-background' : 'mb-1 h-6 w-6 text-gray-500 group-hover:text-primary dark:text-gray-400 dark:group-hover:text-blue-500'} `}
						/>
						<span
							className={` ${currentState === 'Call' ? 'font-bold' : ''} text-sm text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500`}
						>
							Phone
						</span>
					</button>
				</Link> */}
				<div className="flex items-center justify-center">
					<Dialog>
						<DialogTrigger asChild>
							<button
								data-tooltip-target="tooltip-new"
								type="button"
								className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-medium hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
							>
								<svg
									className="h-4 w-4 text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 18 18"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M9 1v16M1 9h16"
									/>
								</svg>
								<span className="sr-only">New item</span>
							</button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Create a New Conference Room</DialogTitle>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<DialogClose asChild>
									<Button
										variant={'outline'}
										className="flex w-full gap-1"
										onClick={() => handleInstantCreateCall()}
									>
										<Laptop />
										Create a Instant Room
									</Button>
								</DialogClose>

								<Separator />
								<div className="flex items-center">
									<Input
										onChange={(event) => setRoomId(event.target.value)}
										value={roomId}
										className="w-full rounded-r-none"
										placeholder="Enter Room Code "
									/>
									<DialogClose asChild>
										<Button
											onClick={() => handleEnterRoom()}
											size={'sm'}
											type="submit"
											className="rounded-l-none"
										>
											Join
										</Button>
									</DialogClose>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>
				<Link
					href={'/'}
					className="group flex items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
				>
					<button
						type="button"
						className="inline-flex flex-col items-center justify-center"
						onClick={() => setCurrentState('Conference')}
					>
						<Laptop
							className={`${currentState === 'Conference' ? 'mb-1 h-6 w-12 rounded-md bg-primary text-background' : 'mb-1 h-6 w-6 text-gray-500 group-hover:text-primary dark:text-gray-400 dark:group-hover:text-blue-500'} `}
						/>
						<span
							className={` ${currentState === 'Conference' ? 'font-bold' : ''} text-sm text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500`}
						>
							Meeting
						</span>
					</button>
				</Link>
				<button
					type="button"
					className="group inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
				>
					<div className="relative mb-1 h-7 w-7">
						<UserProfile />
						{onLineStatus ? (
							<span className="absolute -right-2 -top-1 flex h-3 w-3 rounded-full bg-green-500"></span>
						) : (
							<span className="absolute -right-2 -top-1 flex h-3 w-3 rounded-full bg-red-500"></span>
						)}
					</div>
					<span className="text-sm text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500">
						Profile
					</span>
				</button>
			</div>
		</div>
	);
};

export default BottomNavigation;
