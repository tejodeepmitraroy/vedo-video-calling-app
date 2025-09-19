'use client';
import React, { useEffect, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Settings, Mic, Video as VideoIcon } from 'lucide-react';

interface DeviceSelectorProps {
	label: string;
	devices: MediaDeviceInfo[];
	value: string;
	onChange: (deviceId: string) => void;
}

const DeviceSelector = ({
	label,
	devices,
	value,
	onChange,
}: DeviceSelectorProps) => (
	<div className="space-y-2">
		<Label className="text-sm font-medium text-muted-foreground">{label}</Label>
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger className="w-full min-w-[250px]">
				<SelectValue placeholder={`Select ${label.toLowerCase()}`} />
			</SelectTrigger>
			<SelectContent>
				{devices.map((device) => (
					<SelectItem key={device.deviceId} value={device.deviceId}>
						{device.label || `${label} ${device.deviceId.substring(0, 5)}`}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	</div>
);

const SettingsDialog = () => {
	const [open, setOpen] = useState(false);

	const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
	const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
	const [speakers, setSpeakers] = useState<MediaDeviceInfo[]>([]);

	const [selectedCamera, setSelectedCamera] = useState<string>('');
	const [selectedMicrophone, setSelectedMicrophone] = useState<string>('');
	const [selectedSpeaker, setSelectedSpeaker] = useState<string>('');

	useEffect(() => {
		const getDevices = async () => {
			try {
				const devices = await navigator.mediaDevices.enumerateDevices();
				setCameras(devices.filter((d) => d.kind === 'videoinput'));
				setMicrophones(devices.filter((d) => d.kind === 'audioinput'));
				setSpeakers(devices.filter((d) => d.kind === 'audiooutput'));
			} catch (err) {
				console.error('Unable to enumerate devices', err);
			}
		};

		getDevices();
	}, []);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					className="rounded-full p-2.5"
					aria-label="Settings"
				>
					<Settings className="h-6 w-6" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[800px]">
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
				</DialogHeader>
				<div className="flex w-full gap-6">
					<Tabs defaultValue="audio" className="flex w-full">
						<TabsList className="mr-6 flex w-40 flex-col items-start gap-1 border-r pr-4">
							<TabsTrigger value="audio" className="w-full justify-start gap-2">
								<Mic className="size-4" /> Audio
							</TabsTrigger>
							<TabsTrigger value="video" className="w-full justify-start gap-2">
								<VideoIcon className="size-4" /> Video
							</TabsTrigger>
						</TabsList>
						<div className="flex-1 overflow-y-auto">
							<TabsContent value="audio" className="space-y-6">
								<DeviceSelector
									label="Microphone"
									devices={microphones}
									value={selectedMicrophone}
									onChange={setSelectedMicrophone}
								/>
								<DeviceSelector
									label="Speaker"
									devices={speakers}
									value={selectedSpeaker}
									onChange={setSelectedSpeaker}
								/>
							</TabsContent>
							<TabsContent value="video" className="space-y-6">
								<DeviceSelector
									label="Camera"
									devices={cameras}
									value={selectedCamera}
									onChange={setSelectedCamera}
								/>
							</TabsContent>
						</div>
					</Tabs>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default SettingsDialog;
