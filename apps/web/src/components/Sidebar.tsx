import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { Home, LifeBuoy, Phone, Triangle, Video } from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from './ui/tooltip';
import UserProfile from './UserProfile';

const Sidebar = () => {
	return (
		<aside className=" hidden inset-y fixed left-0 z-20 md:flex h-full w-[60px] flex-col border-r">
			<div className="flex h-[60px] items-center justify-center border-b p-2">
				<Button
					variant="outline"
					size="icon"
					aria-label="Home"
					className="group hover:bg-primary hover:text-white"
				>
					<Video className="group-hover:fill-white size-5 fill-foreground" />
				</Button>
			</div>
			<nav className="grid gap-3 p-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<Link href="/">
							<Button
								variant="ghost"
								size="icon"
								className="rounded-lg hover:bg-primary hover:text-white"
								aria-label="Playground"
							>
								<Home className="size-5" />
							</Button>
						</Link>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Dashboard
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Link href="/room">
							<Button
								variant="ghost"
								size="icon"
								className="rounded-lg hover:bg-primary hover:text-white"
								aria-label="Models"
							>
								<Phone className="size-5" />
							</Button>
						</Link>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Room
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
			<nav className="mt-auto grid gap-1 p-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="mt-auto rounded-lg"
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
							className="mt-auto rounded-lg"
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
