import { Button } from '@/components/ui/button';
import React from 'react';
import { Mic, Video, Volume2 } from 'lucide-react';
import useDeviceStore from '@/store/useDeviceStore';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
		<section className="w-full border">
			{/* Microphone */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" className="rounded-full p-5">
						<Mic className="h-6 w-7" />
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
						>
							{microphone.label}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" className="p-5">
						<Volume2 className="h-7 w-7" />
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
						>
							{speaker.label}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" className="p-5">
						<Video className="h-7 w-7" />
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
						>
							{camera.label}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</section>
	);
};

export default MediaSettings;
