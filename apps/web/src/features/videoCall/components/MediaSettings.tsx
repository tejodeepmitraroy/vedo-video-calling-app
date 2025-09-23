import { Button } from '@/components/ui/button';
import React from 'react';
import { Check, Mic, Video, Volume2 } from 'lucide-react';
import useDeviceStore from '@/store/useDeviceStore';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
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

	const handleDeviceChange = (
		deviceType: 'camera' | 'microphone' | 'speaker',
		deviceId: string
	) => {
		console.log('MediaSettings: Device change requested:', {
			deviceType,
			deviceId,
		});

		if (deviceType === 'camera') {
			setSelectedCamera(deviceId);
		} else if (deviceType === 'microphone') {
			setSelectedMicrophone(deviceId);
		} else {
			setSelectedSpeaker(deviceId);
		}
	};

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
						<div className="truncate">
							{selectedMicrophone.label || 'Select Microphone'}
						</div>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					{mediaDevices?.microphones.map((microphone) => (
						<DropdownMenuItem
							key={microphone.deviceId}
							onClick={() =>
								handleDeviceChange('microphone', microphone.deviceId)
							}
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
						<div className="truncate">
							{selectedSpeaker.label || 'Select Speaker'}
						</div>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					{mediaDevices?.speakers.map((speaker) => (
						<DropdownMenuItem
							key={speaker.deviceId}
							onClick={() => handleDeviceChange('speaker', speaker.deviceId)}
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
						<div className="truncate">
							{selectedCamera.label || 'Select Camera'}
						</div>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					{mediaDevices?.cameras.map((camera) => (
						<DropdownMenuItem
							key={camera.deviceId}
							onClick={() => handleDeviceChange('camera', camera.deviceId)}
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
