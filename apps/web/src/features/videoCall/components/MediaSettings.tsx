import { Button } from '@/components/ui/button';
import React from 'react';
import { Check, Mic, Video, Volume2 } from 'lucide-react';
import useDeviceStore from '@/store/useDeviceStore';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const MediaSettings = () => {
	const mediaDevices = useDeviceStore((state) => state.mediaDevices);
	const selectedMicrophone = useDeviceStore(
		(state) => state.selectedMicrophone
	);
	const selectedSpeaker = useDeviceStore((state) => state.selectedSpeaker);
	const selectedCamera = useDeviceStore((state) => state.selectedCamera);

	const setSelectedMicrophone = useDeviceStore(
		(state) => state.setSelectedMicrophone
	);
	const setSelectedSpeaker = useDeviceStore(
		(state) => state.setSelectedSpeaker
	);
	const setSelectedCamera = useDeviceStore((state) => state.setSelectedCamera);
	return (
		<section className="mx-auto mt-6 grid w-full max-w-xl grid-cols-3 gap-5">
			{/* Microphone */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						className="flex items-center justify-start gap-2 truncate rounded-full p-5 text-sm"
					>
						<span>
							<Mic className="h-5 w-5" />
						</span>
						{selectedMicrophone.label || 'Select Microphone'}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>
						{selectedMicrophone.label || 'Select Microphone'}
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{mediaDevices?.microphones.map((microphone) => (
						<DropdownMenuItem
							key={microphone.deviceId}
							onClick={() => setSelectedMicrophone(microphone.deviceId)}
							className={cn(
								'flex items-center gap-2',
								selectedMicrophone.deviceId === microphone.deviceId &&
									'text-primary'
							)}
						>
							<Check
								className={cn(
									'h-5 w-5',
									selectedMicrophone.deviceId === microphone.deviceId
										? 'text-primary'
										: 'opacity-0'
								)}
							/>
							{microphone.label}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						className="flex items-center justify-start gap-2 truncate rounded-full p-5 text-sm"
					>
						<span>
							<Volume2 className="h-5 w-5" />
						</span>
						{selectedSpeaker.label || 'Select Speaker'}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>
						{selectedSpeaker.label || 'Select Speaker'}
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{mediaDevices?.speakers.map((speaker) => (
						<DropdownMenuItem
							key={speaker.deviceId}
							onClick={() => setSelectedSpeaker(speaker.deviceId)}
							className={cn(
								'flex items-center gap-2',
								selectedSpeaker.deviceId === speaker.deviceId && 'text-primary'
							)}
						>
							<Check
								className={cn(
									'h-5 w-5',
									selectedSpeaker.deviceId === speaker.deviceId
										? 'text-primary'
										: 'opacity-0'
								)}
							/>
							{speaker.label}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						className="flex items-center justify-start gap-2 truncate rounded-full p-5 text-sm"
					>
						<span>
							<Video className="h-5 w-5" />
						</span>
						{selectedCamera.label || 'Select Camera'}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>
						{selectedCamera.label || 'Select Camera'}
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{mediaDevices?.cameras.map((camera) => (
						<DropdownMenuItem
							key={camera.deviceId}
							onClick={() => setSelectedCamera(camera.deviceId)}
							className={cn(
								'flex items-center gap-2',
								selectedCamera.deviceId === camera.deviceId && 'text-primary'
							)}
						>
							<Check
								className={cn(
									'h-5 w-5',
									selectedCamera.deviceId === camera.deviceId
										? 'text-primary'
										: 'opacity-0'
								)}
							/>
							{camera.label}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</section>
	);
};

export default MediaSettings;
