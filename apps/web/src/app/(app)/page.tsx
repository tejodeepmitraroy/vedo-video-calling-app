'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	createInstantCall,
	getRoomDetails,
} from '@/features/videoCall/services';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { IoVideocam } from 'react-icons/io5';
import { BsFillPlusSquareFill } from 'react-icons/bs';
import { FaCalendarDays } from 'react-icons/fa6';
import { MdOutlineScreenShare } from 'react-icons/md';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import DashboardClock from '@/components/DashboardClock';

export default function Dashboard() {
	const [roomId, setRoomId] = useState<string>('');

	const router = useRouter();
	const { getToken } = useAuth();
	const handleInstantCreateCall = async () => {
		const token = await getToken();
		const response = await toast.promise(createInstantCall(token), {
			loading: 'Wait to create a new Room',
			success: 'New Room Created👌',
			error: 'Error happend, New Room Creation rejected 🤯',
		});
		console.log('response', response);
		if (response) {
			const roomId = response.id;
			router.push(`/rm/${roomId}`);
		}
	};

	const handleEnterRoom = async () => {
		const token = await getToken();
		if (roomId) {
			const response = await toast.promise(getRoomDetails(token, roomId), {
				loading: 'Finding Room',
				success: 'Connecting👌',
				error: `Error happend, We don't find the room 🤯`,
			});
			const roomDetails = response;
			console.log('roomDetails', roomDetails);

			router.push(`/rm/${roomDetails.id}`);
		}
	};

	return (
		<div className="flex h-full w-full items-center justify-center px-4 md:flex-1">
			<div className="mx-auto my-4 flex h-full w-fit gap-10">
				<section className="flex w-full flex-col items-center justify-center gap-5">
					<section className="flex w-full items-center justify-center gap-10">
						<div className="flex flex-col items-center justify-center gap-3">
							<Button
								variant={'outline'}
								onClick={() => handleInstantCreateCall()}
								className="h-20 w-20 rounded-3xl bg-amber-700 text-white"
							>
								<IoVideocam className="h-10 w-10" />
							</Button>
							<Label>New Meeting</Label>
						</div>
						<div className="flex flex-col items-center justify-center gap-3">
							<Dialog>
								<DialogTrigger asChild>
									<Button
										variant={'outline'}
										className="bg-primary h-20 w-20 rounded-3xl text-white"
									>
										<BsFillPlusSquareFill className="h-10 w-10" />
									</Button>
								</DialogTrigger>
								<DialogContent className="w-full max-w-sm">
									<DialogHeader>
										<DialogTitle>Join Meeting</DialogTitle>
										<DialogDescription>Enter the meeting ID</DialogDescription>
									</DialogHeader>
									<div className="mb-8 flex items-center gap-2">
										<div className="grid flex-1 gap-2">
											<Label htmlFor="link" className="sr-only">
												Room ID
											</Label>
											<Input
												id="link"
												placeholder="Meeting ID or Room ID"
												value={roomId}
												onChange={(e) => setRoomId(e.target.value)}
											/>
										</div>
									</div>
									<DialogFooter className="justify-start">
										<Button
											onClick={() => handleEnterRoom()}
											type="button"
											variant="default"
											disabled={!roomId}
										>
											Join
										</Button>
										<DialogClose asChild>
											<Button type="button" variant="secondary">
												Close
											</Button>
										</DialogClose>
									</DialogFooter>
								</DialogContent>
							</Dialog>
							<Label>Join</Label>
						</div>
					</section>
					<section className="flex w-full items-center justify-center gap-10">
						<div className="flex flex-col items-center justify-center gap-3">
							<Dialog>
								<DialogTrigger asChild>
									<Button
										variant={'outline'}
										className="bg-primary h-20 w-20 rounded-3xl text-white"
									>
										<FaCalendarDays className="h-10 w-10" />
									</Button>
								</DialogTrigger>
								<DialogContent className="w-full max-w-sm">
									<DialogHeader>
										<DialogTitle>Join Meeting</DialogTitle>
										<DialogDescription>Enter the meeting ID</DialogDescription>
									</DialogHeader>
									<div className="mb-8 flex items-center gap-2">
										<div className="grid flex-1 gap-2">
											<Label htmlFor="link" className="sr-only">
												Room ID
											</Label>
											<Input
												id="link"
												placeholder="Meeting ID or Room ID"
												value={roomId}
												onChange={(e) => setRoomId(e.target.value)}
											/>
										</div>
									</div>
									<DialogFooter className="justify-start">
										<Button
											onClick={() => handleEnterRoom()}
											type="button"
											variant="default"
										>
											Join
										</Button>
										<DialogClose asChild>
											<Button type="button" variant="secondary">
												Close
											</Button>
										</DialogClose>
									</DialogFooter>
								</DialogContent>
							</Dialog>

							<Label>Schedule</Label>
						</div>
						<div className="flex flex-col items-center justify-center gap-3">
							<Button
								variant={'outline'}
								className="bg-primary h-20 w-20 rounded-3xl text-white"
							>
								<MdOutlineScreenShare className="h-10 w-10" />
							</Button>
							<Label>Share Screen</Label>
						</div>
					</section>
				</section>
				<section className="hidden w-full flex-col items-center justify-center gap-5 md:flex">
					<Card className="w-full max-w-xl">
						<CardHeader className="bg-primary rounded-t-lg text-white">
							<DashboardClock />
						</CardHeader>
						<CardContent className="p-6"></CardContent>
					</Card>
				</section>
			</div>
		</div>
	);
}
