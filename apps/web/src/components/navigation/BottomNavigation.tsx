import { Home, Laptop, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import UserProfile from '../../feature/auth/components/UserProfile';
import useScreenStateStore from '@/store/useScreenStateStore';
import useGlobalStore from '@/store/useGlobalStore';
import { Input } from '../ui/input';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';

import { Separator } from '../ui/separator';

import Link from 'next/link';

const BottomNavigation = () => {
	const [roomId, setRoomId] = useState<string>('');
	const setCurrentState = useScreenStateStore(
		(state) => state.setCurrentScreen
	);
	const currentState = useScreenStateStore((state) => state.currentScreen);

	const { getToken } = useAuth();
	const router = useRouter();

	const onLineStatus = useGlobalStore((state) => state.onLineStatus);

	const handleInstantCreateCall = async () => {
		const token = await getToken();

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
				loading: 'Wait to create a new Room',
				success: 'New Room Created👌',
				error: 'Error happend, New Room Creation rejected 🤯',
			}
		);

		// console.log(data.data);

		const response: RoomDetails = data.data;
		const roomId = response.id;

		router.push(`?roomId=${roomId}`);
	};

	const handleEnterRoom = async () => {
		const token = await getToken();
		console.log('Enter Room', roomId);
		if (roomId) {
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
					loading: 'Finding Room',
					success: 'Connecting👌',
					error: `Error happend, We don't find the room 🤯`,
				}
			);

			console.log(data);

			router.push(`?roomId=${roomId}`);
		}
	};

	return (
		<div
			className={`h-16 w-full border-t border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700 md:hidden`}
		>
			<div className="mx-auto grid h-full max-w-lg grid-cols-4 font-medium">
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
				<Link
					href={'/'}
					className="group flex items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
				>
					<Dialog>
						<DialogTrigger asChild>
							<button
								type="button"
								className="inline-flex flex-col items-center justify-center"
							>
								<Plus
									className={`mb-1 h-6 w-6 text-gray-500 group-hover:text-primary dark:text-gray-400 dark:group-hover:text-blue-500`}
								/>
								<span
									className={`text-sm text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500`}
								>
									Start
								</span>
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
				</Link>
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

				{/* <div className="flex items-center justify-center">
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
				</div> */}

				{/* <Link
					href={'/'}
					className="group flex items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
				>
					<button
						type="button"
						className="inline-flex flex-col items-center justify-center"
						onClick={() => setCurrentState('Conference')}
					>
						<Settings
							className={`${currentState === 'Conference' ? 'mb-1 h-6 w-12 rounded-md bg-primary text-background' : 'mb-1 h-6 w-6 text-gray-500 group-hover:text-primary dark:text-gray-400 dark:group-hover:text-blue-500'} `}
						/>
						<span
							className={` ${currentState === 'Conference' ? 'font-bold' : ''} text-sm text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500`}
						>
							Settings
						</span>
					</button>
				</Link> */}

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
