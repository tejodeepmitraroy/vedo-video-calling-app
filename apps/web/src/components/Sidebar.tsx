'use client';

import React from 'react';
import { Button } from './ui/button';
import { Home, Laptop, LifeBuoy, Phone, Video } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import UserProfile from './UserProfile';
import useScreenStateStore from '@/store/useScreenStateStore';

const Sidebar = () => {
	// const pathname = usePathname();
	// const option = pathname.split('/')[1];
	const setCurrentState = useScreenStateStore(
		(state) => state.setCurrentScreen
	);
	const currentState = useScreenStateStore((state) => state.currentScreen);

	return (
		// <aside className="inset-y fixed left-0 z-20 hidden h-full w-[60px] flex-col border-r bg-slate-300 md:flex">
		<aside className="inset-y fixed left-0 z-20 hidden h-full w-[60px] flex-col md:flex">
			{/* <div className="flex h-[60px] items-center justify-center border-b p-2"> */}
			<div className="flex h-[60px] items-center justify-center pt-2">
				<Button
					variant="outline"
					size="icon"
					aria-label="Home"
					className="group hover:bg-primary hover:text-white"
				>
					<Video className="size-5 fill-foreground group-hover:fill-white" />
				</Button>
			</div>
			{/* <nav className="grid gap-3 p-2"> */}
			<nav className="item flex h-full flex-col items-center gap-2 pt-3">
				<Tooltip>
					<TooltipTrigger asChild>
						{/* <Link href="/"> */}
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setCurrentState('dashboard')}
							// className={`${option === '' ? 'bg-background text-primary' : 'text-background'} hover:text-primary`}
							className={`${currentState === 'dashboard' ? 'bg-background text-primary' : 'text-background'} hover:text-primary`}
							aria-label="Home"
						>
							<Home className="size-5" />
						</Button>
						{/* </Link> */}
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Dashboard
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						{/* <Link href="/room"> */}
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setCurrentState('room')}
							// className={`${option === 'room' ? 'bg-background text-primary' : 'text-background'} hover:text-primary`}
							className={`${currentState === 'room' ? 'bg-background text-primary' : 'text-background'} hover:text-primary`}
							aria-label="Models"
						>
							<Phone className="size-5" />
						</Button>
						{/* </Link> */}
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Room
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						{/* <Link href="/meet"> */}
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setCurrentState('meet')}
							// className={`${option === 'meet' ? 'bg-background text-primary' : 'text-background'} hover:text-primary`}
							className={`${currentState === 'meet' ? 'bg-background text-primary' : 'text-background'} hover:text-primary`}
							aria-label="Models"
						>
							<Laptop className="size-5" />
						</Button>
						{/* </Link> */}
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Conference
					</TooltipContent>
				</Tooltip>

				{/*<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="rounded-lg"
							aria-label="API"
						>
							<Code2 className="size-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						API
					</TooltipContent>
				</Tooltip>
				 <Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="rounded-lg"
							aria-label="Documentation"
						>
							<Book className="size-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Documentation
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="rounded-lg"
							aria-label="Settings"
						>
							<Settings2 className="size-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Settings
					</TooltipContent>
				</Tooltip> */}
			</nav>
			{/* <nav className="mt-auto grid gap-1 p-2"> */}
			<nav className="mb-6 mt-auto flex flex-col items-center gap-1">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="mt-auto rounded-lg text-white hover:bg-background hover:text-primary"
							aria-label="Help"
						>
							<LifeBuoy className="size-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Help
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="mt-auto rounded-lg hover:bg-background hover:text-primary"
							aria-label="Account"
						>
							<UserProfile />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Account
					</TooltipContent>
				</Tooltip>
			</nav>
		</aside>
	);
};

export default Sidebar;
