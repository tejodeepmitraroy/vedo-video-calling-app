'use client';
import React from 'react';
import { Input } from '@/components/ui/input';
// import { Video, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import NavBar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import BottomNavigation from '@/components/BottomNavigation';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const Meet = () => {
	// const { getToken } = useAuth();
	// const router = useRouter();

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
	// 		const roomId = data.data.roomId;
	// 		// const userId = data.data.createdById;

	// 		router.push(`/room/${roomId}`);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };
	return (
		<div className="grid h-screen w-full bg-primary md:pl-[55px]">
			<Sidebar />
			<div className="flex h-full flex-col">
				<NavBar heading="Room" />
				<main className="flex h-full w-full flex-1 flex-col gap-4 pb-2 pr-2 lg:gap-6">
					<div className="flex flex-1 rounded-lg bg-background shadow-sm">
						<div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-2">
							<Card className="row-span-2 overflow-y-auto rounded-l-lg rounded-r-none bg-slate-100">
								<CardHeader className="flex flex-col gap-3">
									<CardTitle>Search for a Call</CardTitle>

									{/* <div className="flex w-full gap-3">
										<Button
											onClick={() => handleInstantCreateCall()}
											className="flex w-full gap-3"
										>
											<PlusCircle />
											Create a Room
										</Button>
										<Button className="flex w-full gap-3">
											<Search />
											Join a Room
										</Button>
									</div> */}
									<CardDescription className="flex gap-7">
										<Input placeholder="Name, email " />
										<Button>
											<Search />
										</Button>
									</CardDescription>
								</CardHeader>
								<CardContent className="w-full">
									<ScrollArea className="h-[70vh] w-full rounded-md border bg-white p-4">
										<div className="flex flex-col gap-3"></div>
									</ScrollArea>
								</CardContent>
							</Card>
							<Card className="col-span-3 row-span-2 overflow-y-auto rounded-l-none rounded-r-lg bg-slate-100">
								<CardHeader className="flex flex-col gap-3">
									<CardTitle>Search for a Call</CardTitle>

									{/* <div className="flex w-full gap-3">
										<Button
											onClick={() => handleInstantCreateCall()}
											className="flex w-full gap-3"
										>
											<PlusCircle />
											Create a Room
										</Button>
										<Button className="flex w-full gap-3">
											<Search />
											Join a Room
										</Button>
									</div> */}
									<CardDescription className="flex gap-7">
										<Input placeholder="Name, email " />
										<Button>
											<Search />
										</Button>
									</CardDescription>
								</CardHeader>
								<CardContent className="w-full">
									<ScrollArea className="h-[70vh] w-full rounded-md border bg-white p-4">
										<div className="flex flex-col gap-3"></div>
									</ScrollArea>
								</CardContent>
							</Card>
						</div>
						{/* <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
								<div className="flex flex-col gap-10 p-4 md:flex-row">
									<div className="flex flex-col items-center gap-1 rounded-lg border border-dashed p-10 text-center shadow-sm">
										<h3 className="text-2xl font-bold tracking-tight">
											Create a Meeting Room
										</h3>

										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button className="mt-4">New Meeting</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent className="p-3">
												<DropdownMenuItem className="flex justify-between gap-5 text-lg">
													<Video />
													Start an instant meeting
												</DropdownMenuItem>
												<DropdownMenuItem className="flex justify-between gap-5 text-lg">
													<Plus />
													Create a Meeting for later
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
									<div className="flex flex-col items-center gap-1 rounded-lg border border-dashed p-10 text-center shadow-sm">
										<h3 className="text-2xl font-bold tracking-tight">
											Enter Code for Get in Room
										</h3>

										<div className="flex w-full">
											<Input className="mt-4 rounded-r-none" />
											<Button className="mt-4 rounded-l-none">Join</Button>
										</div>
									</div>
								</div>
							</div> */}
					</div>
				</main>
			</div>
			<BottomNavigation />
		</div>
	);
};

export default Meet;
