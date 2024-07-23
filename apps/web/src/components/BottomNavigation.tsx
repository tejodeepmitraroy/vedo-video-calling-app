import { Home, Laptop, Phone } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './ui/button';
import UserProfile from './UserProfile';
import useScreenStateStore from '@/store/useScreenStateStore';
import useGlobalStore from '@/store/useGlobalStore';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Input } from './ui/input';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const BottomNavigation = () => {
	const [roomId, setRoomId] = useState<string>('');
	const setCurrentState = useScreenStateStore(
		(state) => state.setCurrentScreen
	);

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

			router.push(`/room/${roomId}`);
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

				router.push(`/room/${roomId}`);
			} catch (error) {
				console.log(error);
			}
		}
	};
	return (
		<div className="fixed bottom-4 left-1/2 z-50 h-16 w-full max-w-lg -translate-x-1/2 rounded-full border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700 md:hidden">
			<div className="mx-auto grid h-full max-w-lg grid-cols-5">
				<button
					data-tooltip-target="tooltip-home"
					onClick={() => setCurrentState('Dashboard')}
					type="button"
					className="group inline-flex flex-col items-center justify-center rounded-s-full px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
				>
					<Home className="mb-1 h-6 w-6 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500" />
					<span className="sr-only">Home</span>
				</button>
				<div
					id="tooltip-home"
					role="tooltip"
					className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
				>
					Home
					<div className="tooltip-arrow" data-popper-arrow></div>
				</div>
				<button
					data-tooltip-target="tooltip-wallet"
					type="button"
					onClick={() => setCurrentState('Call')}
					className="group inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
				>
					<Phone className="mb-1 h-6 w-6 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500" />
					<span className="sr-only">Call</span>
				</button>
				<div
					id="tooltip-wallet"
					role="tooltip"
					className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
				>
					Call
					<div className="tooltip-arrow" data-popper-arrow></div>
				</div>
				<div className="flex items-center justify-center">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
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
						</DropdownMenuTrigger>
						<DropdownMenuContent className="mb-5 flex w-full flex-col gap-3 p-3">
							<DropdownMenuCheckboxItem className="p-0">
								<Button
									variant={'outline'}
									className="w-full"
									onClick={() => handleInstantCreateCall()}
								>
									<Laptop />
									Create a Instant Room
								</Button>
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem className="p-0">
								<Input
									onChange={(event) => setRoomId(event.target.value)}
									value={roomId}
									className="w-full rounded-r-none"
									placeholder="Enter Room Code "
								/>
								<Button
									onClick={() => handleEnterRoom()}
									size={'sm'}
									type="submit"
									className="rounded-l-none"
								>
									Join
								</Button>
							</DropdownMenuCheckboxItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div
					id="tooltip-new"
					role="tooltip"
					className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
				>
					Create new item
					<div className="tooltip-arrow" data-popper-arrow></div>
				</div>
				<button
					data-tooltip-target="tooltip-settings"
					type="button"
					onClick={() => setCurrentState('Room')}
					className="group inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
				>
					<Laptop className="mb-1 h-6 w-6 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500" />
					<span className="sr-only">Room</span>
				</button>
				<div
					id="tooltip-settings"
					role="tooltip"
					className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
				>
					Settings
					<div className="tooltip-arrow" data-popper-arrow></div>
				</div>
				<button
					data-tooltip-target="tooltip-profile"
					type="button"
					className="group inline-flex flex-col items-center justify-center rounded-e-full px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
				>
					<UserProfile />
					{onLineStatus ? (
						<span className="absolute right-2 top-4 me-3 flex h-3 w-3 rounded-full bg-green-500"></span>
					) : (
						<span className="absolute right-2 top-4 me-3 flex h-3 w-3 rounded-full bg-red-500"></span>
					)}
					<span className="sr-only">Profile</span>
				</button>
				<div
					id="tooltip-profile"
					role="tooltip"
					className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
				>
					Profile
					<div className="tooltip-arrow" data-popper-arrow></div>
				</div>
			</div>
		</div>
	);
};

export default BottomNavigation;
