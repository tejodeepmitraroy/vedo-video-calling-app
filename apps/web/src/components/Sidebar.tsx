'use client';
import React from 'react';
import { Button } from './ui/button';
import {
	Home,
	Laptop,
	//   Phone,
	// Settings,
	Video,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import UserProfile from './UserProfile';
import useScreenStateStore from '@/store/useScreenStateStore';
import useGlobalStore from '@/store/useGlobalStore';

import Link from 'next/link';

const Sidebar = () => {
	const setCurrentState = useScreenStateStore(
		(state) => state.setCurrentScreen
	);
	const currentState = useScreenStateStore((state) => state.currentScreen);
	const onLineStatus = useGlobalStore((state) => state.onLineStatus);
	// const mediaDevices = useDeviceStore((state) => state.mediaDevices);
	// const setSelectedCamera = useDeviceStore((state) => state.setSelectedCamera);
	// const setSelectedMicrophone = useDeviceStore(
	// 	(state) => state.setSelectedMicrophone
	// );
	// const selectedCamera = useDeviceStore((state) => state.selectedCamera);
	// const selectedMicrophone = useDeviceStore(
	// 	(state) => state.selectedMicrophone
	// );

	return (
		<aside className="inset-y fixed left-0 z-20 hidden h-full w-[60px] flex-col md:flex">
			<div className="flex h-[60px] items-center justify-center pt-2">
				<Button
					variant="outline"
					size="icon"
					aria-label="Home"
					onClick={() => setCurrentState('Dashboard')}
					className="group hover:bg-primary hover:text-white"
				>
					<Video className="size-5 fill-foreground group-hover:fill-white" />
				</Button>
			</div>

			<nav className="item flex h-full flex-col items-center gap-2 pt-3">
				<Tooltip>
					<TooltipTrigger asChild>
						<Link href={'/'}>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setCurrentState('Dashboard')}
								className={`${currentState === 'Dashboard' ? 'bg-background text-primary' : 'text-background'} hover:text-primary`}
								aria-label="Home"
							>
								<Home className="size-5" />
							</Button>
						</Link>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Dashboard
					</TooltipContent>
				</Tooltip>
				{/* <Tooltip>
					<TooltipTrigger asChild>
						<Link href={'/'}>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setCurrentState('Call')}
								// className={`${option === 'room' ? 'bg-background text-primary' : 'text-background'} hover:text-primary`}
								className={`${currentState === 'Call' ? 'bg-background text-primary' : 'text-background'} hover:text-primary`}
								aria-label="Models"
							>
								<Phone className="size-5" />
							</Button>
						</Link>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Call
					</TooltipContent>
				</Tooltip> */}
				<Tooltip>
					<TooltipTrigger asChild>
						<Link href={'/'}>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setCurrentState('Conference')}
								className={`${currentState === 'Conference' || currentState === 'ConferenceRoom' ? 'bg-background text-primary' : 'text-background'} hover:text-primary`}
								aria-label="Models"
							>
								<Laptop className="size-5" />
							</Button>
						</Link>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Conference
					</TooltipContent>
				</Tooltip>
			</nav>

			<nav className="mb-6 mt-auto flex flex-col items-center gap-1">
				{/* <Dialog>
					<DialogTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="mt-auto rounded-lg text-white hover:bg-background hover:text-primary"
							aria-label="Help"
						>
							<Settings className="size-5" />
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Edit profile</DialogTitle>
							<DialogDescription>
								Make changes to your profile here. Click save when you&apos;re
								done.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="name" className="text-right">
									Camera
								</Label>
								<Select
									value={selectedCamera}
									onValueChange={(value) => setSelectedCamera(value)}
								>
									<SelectTrigger className="col-span-3">
										<SelectValue placeholder="Select a Camera" />
									</SelectTrigger>
									<SelectContent>
										{mediaDevices?.cameras.map((camera) => (
											<SelectItem value={camera.deviceId} key={camera.deviceId}>
												{camera.label || `Camera ${camera.deviceId}`}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="username" className="text-right">
									MicroPhone
								</Label>
								<Select
									value={selectedMicrophone}
									onValueChange={(value) => setSelectedMicrophone(value)}
								>
									<SelectTrigger className="col-span-3">
										<SelectValue placeholder="Select a Micro Phone" />
									</SelectTrigger>
									<SelectContent>
										{mediaDevices?.microphones.map((microphone) => (
											<SelectItem
												value={microphone.deviceId}
												key={microphone.deviceId}
											>
												{microphone.label ||
													`Microphone ${microphone.deviceId}`}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<DialogFooter>
							<Button type="submit">Save changes</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog> */}
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="relative mt-auto rounded-lg hover:bg-background hover:text-primary"
							aria-label="Account"
						>
							<UserProfile />
							{onLineStatus ? (
								<span className="absolute -right-2 top-0 me-3 flex h-3 w-3 rounded-full bg-green-500"></span>
							) : (
								<span className="absolute -right-2 top-0 me-3 flex h-3 w-3 rounded-full bg-red-500"></span>
							)}
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
