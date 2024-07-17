import { Home, Laptop, Phone } from 'lucide-react';
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import UserProfile from './UserProfile';
import useScreenStateStore from '@/store/useScreenStateStore';

const BottomNavigation = () => {
	const setCurrentState = useScreenStateStore(
		(state) => state.setCurrentScreen
	);
	const currentState = useScreenStateStore((state) => state.currentScreen);
	return (
		<div className="fixed bottom-0 left-0 flex h-20 w-full items-center border border-t bg-slate-100 md:hidden">
			<nav className="flex w-full justify-evenly gap-1">
				<Tooltip>
					<TooltipTrigger asChild>
						{/* <Link href="/"> */}
						<Button
							variant="ghost"
							onClick={() => setCurrentState('dashboard')}
							className="flex flex-col gap-1 p-0"
							aria-label="Home"
						>
							<div
								className={`${currentState === 'dashboard' ? 'bg-primary text-white' : 'text-black'} rounded-lg px-3`}
							>
								<Home className="size-7" />
							</div>
							<span
								className={`${currentState === 'dashboard' ? 'font-bold' : 'font-medium'}`}
							>
								Home
							</span>
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
							onClick={() => setCurrentState('room')}
							className="flex flex-col gap-1 p-0"
							aria-label="Room"
						>
							<div
								className={`${currentState === 'room' ? 'bg-primary text-white' : 'text-black'} rounded-lg px-3`}
							>
								<Phone className="size-7" />
							</div>
							<span
								className={`${currentState === 'room' ? 'font-bold' : 'font-medium'} `}
							>
								Phone
							</span>
						</Button>
						{/* </Link> */}
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Room
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						{/* <Link href="/room"> */}
						<Button
							variant="ghost"
							onClick={() => setCurrentState('meet')}
							className="flex flex-col gap-1 p-0"
							aria-label="Room"
						>
							<div
								className={`${currentState === 'meet' ? 'bg-primary text-white' : 'text-black'} rounded-lg px-3`}
							>
								<Laptop className="size-7" />
							</div>
							<span
								className={`${currentState === 'meet' ? 'font-bold' : 'font-medium'} `}
							>
								Conference
							</span>
						</Button>
						{/* </Link> */}
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Conference
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						{/* <Link href="/room"> */}
						<Button
							variant="ghost"
							onClick={() => setCurrentState('meet')}
							className="group flex flex-col p-0 font-medium hover:font-bold"
							aria-label="Room"
						>
							<div
								className={`rounded-lg px-3 group-hover:bg-primary group-hover:text-white`}
							>
								<UserProfile />
							</div>
							<span>Account</span>
						</Button>
						{/* </Link> */}
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Account
					</TooltipContent>
				</Tooltip>

				{/* <Tooltip>
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
				</Tooltip> */}
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
