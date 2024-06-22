'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
	Home,
	LineChart,
	Package,
	Package2,
	PanelLeft,
	Settings,
	ShoppingCart,
	Users2,
	Video,
	MessagesSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import ControlPanel, { Device } from './components/ui/ControlPanel';

import { useRoomStore } from '@/store/useStore';
import ScreenSharePanel from './components/ui/ScreenSharePanel';
import UserVideoPanel from './components/ui/UserVideoPanel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSocket } from '@/context/SocketContext';
import { useUser } from '@clerk/nextjs';
import UserProfile from '@/components/UserProfile';

export default function CallPanel({ params }: { params: { id: string } }) {
	const stream = useRoomStore((state) => state.stream);
	const screenStream = useRoomStore((state) => state.screenStream);
	const isMicrophoneOn = useRoomStore((state) => state.isMicrophoneOn);
	

	const { joinRoom, socket } = useSocket();

	useEffect(()=>{},[])


	return (
		<div className="flex h-screen w-full flex-col bg-muted/40">
			<aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
				<nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
					<Link
						href="/"
						className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
					>
						<Video className="h-4 w-4 transition-all group-hover:scale-110" />
						<span className="sr-only">Acme Inc</span>
					</Link>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href="/"
									className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
								>
									<Home className="h-5 w-5" />
									<span className="sr-only">Dashboard</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right">Dashboard</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href="#"
									className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
								>
									<MessagesSquare className="h-5 w-5" />
									<span className="sr-only">Orders</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right">Orders</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href="#"
									className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
								>
									<Package className="h-5 w-5" />
									<span className="sr-only">Products</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right">Products</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href="#"
									className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
								>
									<Users2 className="h-5 w-5" />
									<span className="sr-only">Customers</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right">Customers</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href="#"
									className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
								>
									<LineChart className="h-5 w-5" />
									<span className="sr-only">Analytics</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right">Analytics</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</nav>
				<nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								{/* <Link
									href="#"
									className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
								>
									<Settings className="h-5 w-5" />
									<span className="sr-only">Settings</span>
								</Link> */}
								<UserProfile/>
							</TooltipTrigger>
							<TooltipContent side="right">Settings</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</nav>
			</aside>
			<div className="relative flex h-screen w-full flex-col sm:pl-14">
				<header className="fixed top-0 z-30 flex h-14 w-full items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
					<Sheet>
						<SheetTrigger asChild>
							<Button size="icon" variant="outline" className="sm:hidden">
								<PanelLeft className="h-5 w-5" />
								<span className="sr-only">Toggle Menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="sm:max-w-xs">
							<nav className="grid gap-6 text-lg font-medium">
								<Link
									href="/"
									className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
								>
									<Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
									<span className="sr-only">Acme Inc</span>
								</Link>
								<Link
									href="/"
									className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
								>
									<Home className="h-5 w-5" />
									Dashboard
								</Link>
								<Link
									href="#"
									className="flex items-center gap-4 px-2.5 text-foreground"
								>
									<ShoppingCart className="h-5 w-5" />
									Orders
								</Link>
								<Link
									href="#"
									className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
								>
									<Package className="h-5 w-5" />
									Products
								</Link>
								<Link
									href="#"
									className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
								>
									<Users2 className="h-5 w-5" />
									Customers
								</Link>
								<Link
									href="#"
									className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
								>
									<LineChart className="h-5 w-5" />
									Settings
								</Link>
							</nav>
						</SheetContent>
					</Sheet>
				</header>
				<main className="relative h-full w-full overflow-hidden">
					<div className="flex h-[91vh] w-full border-red-500 bg-black px-5 py-8">
						{screenStream ? (
							<div className="flex h-full w-full">
								<div className="relative flex aspect-video w-[75%] items-center justify-center">
									<ScreenSharePanel />
								</div>
								<div className="flex w-[25%] flex-col justify-center gap-5 p-5">
									<UserVideoPanel stream={stream} muted={!isMicrophoneOn} />
									<UserVideoPanel stream={stream} muted={false} />
								</div>
							</div>
						) : (
							<ScrollArea className="w-full">
								<div className="grid h-full w-full grid-cols-2 items-center justify-center gap-4 overflow-y-auto border border-white p-5">
									<UserVideoPanel stream={stream} muted={!isMicrophoneOn} />
								</div>
							</ScrollArea>
						)}
					</div>
					<div className="h-[9vh] w-full">
						<ControlPanel />
					</div>
					{/* <div className="absolute bottom-[15vh] right-10 z-40 w-[14vw]">
						<UserVideoPanel stream={stream} muted={true} />
					</div> */}
				</main>
			</div>
		</div>
	);
}
