import {

	Home,

	Phone,
	Presentation,

} from 'lucide-react';
import React from 'react';
import {
	Tooltip,
	TooltipContent,

	TooltipTrigger,
} from './ui/tooltip';
import { Button } from './ui/button';
import Link from 'next/link';
import UserProfile from './UserProfile';

const BottomNavigation = () => {
	return (
		<div className="fixed bottom-0 left-0 md:hidden flex h-14 w-full items-center border border-t bg-background">
			<nav className="flex w-full justify-evenly gap-1">
				<Tooltip>
					<TooltipTrigger asChild>
						<Link href="/">
							<Button
								variant="ghost"
								className="rounded-lg hover:bg-primary hover:text-white"
								aria-label="Dashboard"
							>
								<Home className="size-7" />
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
								className="rounded-lg hover:bg-primary hover:text-white"
								aria-label="Room"
							>
								<Phone className="size-7" />
							</Button>
						</Link>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Room
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Link href="/meet">
							<Button
								variant="ghost"
								className="rounded-lg hover:bg-primary hover:text-white"
								aria-label="Room"
							>
								<Presentation className="size-7" />
							</Button>
						</Link>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Meeting
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							className="mt-auto rounded-lg hover:bg-primary hover:text-white"
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
		</div>

		// <TooltipProvider>
		// 	<aside className="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
		// 		<div className="border-b p-2">
		// 			<Button variant="outline" size="icon" aria-label="Home">
		// 				<Triangle className="size-5 fill-foreground" />
		// 			</Button>
		// 		</div>
		// 		<nav className="grid gap-1 p-2">
		// 			<Tooltip>
		// 				<TooltipTrigger asChild>
		// 					<Button
		// 						variant="ghost"
		// 						size="icon"
		// 						className="rounded-lg bg-muted"
		// 						aria-label="Playground"
		// 					>
		// 						<SquareTerminal className="size-5" />
		// 					</Button>
		// 				</TooltipTrigger>
		// 				<TooltipContent side="right" sideOffset={5}>
		// 					Playground
		// 				</TooltipContent>
		// 			</Tooltip>
		// 			<Tooltip>
		// 				<TooltipTrigger asChild>
		// 					<Button
		// 						variant="ghost"
		// 						size="icon"
		// 						className="rounded-lg"
		// 						aria-label="Models"
		// 					>
		// 						<Bot className="size-5" />
		// 					</Button>
		// 				</TooltipTrigger>
		// 				<TooltipContent side="right" sideOffset={5}>
		// 					Models
		// 				</TooltipContent>
		// 			</Tooltip>
		// 			<Tooltip>
		// 				<TooltipTrigger asChild>
		// 					<Button
		// 						variant="ghost"
		// 						size="icon"
		// 						className="rounded-lg"
		// 						aria-label="API"
		// 					>
		// 						<Code2 className="size-5" />
		// 					</Button>
		// 				</TooltipTrigger>
		// 				<TooltipContent side="right" sideOffset={5}>
		// 					API
		// 				</TooltipContent>
		// 			</Tooltip>
		// 			<Tooltip>
		// 				<TooltipTrigger asChild>
		// 					<Button
		// 						variant="ghost"
		// 						size="icon"
		// 						className="rounded-lg"
		// 						aria-label="Documentation"
		// 					>
		// 						<Book className="size-5" />
		// 					</Button>
		// 				</TooltipTrigger>
		// 				<TooltipContent side="right" sideOffset={5}>
		// 					Documentation
		// 				</TooltipContent>
		// 			</Tooltip>
		// 			<Tooltip>
		// 				<TooltipTrigger asChild>
		// 					<Button
		// 						variant="ghost"
		// 						size="icon"
		// 						className="rounded-lg"
		// 						aria-label="Settings"
		// 					>
		// 						<Settings2 className="size-5" />
		// 					</Button>
		// 				</TooltipTrigger>
		// 				<TooltipContent side="right" sideOffset={5}>
		// 					Settings
		// 				</TooltipContent>
		// 			</Tooltip>
		// 		</nav>
		// 		<nav className="mt-auto grid gap-1 p-2">
		// 			<Tooltip>
		// 				<TooltipTrigger asChild>
		// 					<Button
		// 						variant="ghost"
		// 						size="icon"
		// 						className="mt-auto rounded-lg"
		// 						aria-label="Help"
		// 					>
		// 						<LifeBuoy className="size-5" />
		// 					</Button>
		// 				</TooltipTrigger>
		// 				<TooltipContent side="right" sideOffset={5}>
		// 					Help
		// 				</TooltipContent>
		// 			</Tooltip>
		// 			<Tooltip>
		// 				<TooltipTrigger asChild>
		// 					<Button
		// 						variant="ghost"
		// 						size="icon"
		// 						className="mt-auto rounded-lg"
		// 						aria-label="Account"
		// 					>
		// 						<SquareUser className="size-5" />
		// 					</Button>
		// 				</TooltipTrigger>
		// 				<TooltipContent side="right" sideOffset={5}>
		// 					Account
		// 				</TooltipContent>
		// 			</Tooltip>
		// 		</nav>
		// 	</aside>
		// </TooltipProvider>
	);
};

export default BottomNavigation;
