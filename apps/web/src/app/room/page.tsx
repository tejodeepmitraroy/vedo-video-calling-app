'use client';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Video, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import {
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NavBar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import BottomNavigation from '@/components/BottomNavigation';

const page = () => {
	return (
		<div className="grid h-screen w-full md:pl-[60px]">
			<Sidebar />
			<div className="flex flex-col">
				<NavBar heading="Room" />
				<main className="mb-14 flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
					{/* <div className="flex items-center">
						<h1 className="text-lg font-semibold md:text-2xl">
							Create a new Room
						</h1>
					</div> */}
					<div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
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
					</div>
				</main>
			</div>
			<BottomNavigation />
		</div>
	);
};

export default page;
