'use client';
import React, { useState } from 'react';
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

import { MdOutlineSpeaker } from 'react-icons/md';
import { IoVideocamOutline } from 'react-icons/io5';
import useDeviceStore from '@/store/useDeviceStore';
import { cn } from '@/lib/utils';

interface DeviceSelectorProps {
	label: string;
	devices?: MediaDeviceInfo[];
	value: string;
	onChange: (deviceId: string) => void;
}

const DeviceSelector = ({
	label,
	devices,
	value,
	onChange,
}: DeviceSelectorProps) => (
	<div className="space-y-5">
		<Label className="text-muted-foreground text-sm font-medium">{label}</Label>
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger className="w-full min-w-[250px]">
				<SelectValue placeholder={`Select ${label.toLowerCase()}`} />
			</SelectTrigger>
			<SelectContent>
				{devices?.map((device) => (
					<SelectItem
						className={cn(
							'flex items-center gap-2',
							value === device.deviceId && 'text-primary'
						)}
						key={device.deviceId}
						value={device.deviceId}
					>
						{device.label || `${label} ${device.deviceId.substring(0, 5)}`}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	</div>
);

const SettingsDialog = ({ children }: { children: React.ReactNode }) => {
	const [open, setOpen] = useState(false);

	const mediaDevices = useDeviceStore((state) => state.mediaDevices);
	const selectedCamera = useDeviceStore((state) => state.selectedCamera);
	const selectedMicrophone = useDeviceStore(
		(state) => state.selectedMicrophone
	);
	const selectedSpeaker = useDeviceStore((state) => state.selectedSpeaker);

	const setSelectedCamera = useDeviceStore((state) => state.setSelectedCamera);
	const setSelectedMicrophone = useDeviceStore(
		(state) => state.setSelectedMicrophone
	);
	const setSelectedSpeaker = useDeviceStore(
		(state) => state.setSelectedSpeaker
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger>{children}</DialogTrigger>
			<DialogContent className="h-[calc(100vh-20rem)] w-full max-w-[800px]">
				<Tabs defaultValue="audio" className="grid h-full w-full grid-cols-3">
					<section className="col-span-1 flex flex-col gap-3 border-r-2 pr-4">
						<DialogHeader className="col-span-1 w-full">
							<DialogTitle className="text-3xl font-semibold">
								Settings
							</DialogTitle>
						</DialogHeader>

						<TabsList className="bg-background flex h-full w-full flex-col justify-start gap-2">
							<TabsTrigger value="audio" className="w-full justify-start gap-2">
								<MdOutlineSpeaker className="size-7" /> Audio
							</TabsTrigger>
							<TabsTrigger value="video" className="w-full justify-start gap-2">
								<IoVideocamOutline className="size-7" /> Video
							</TabsTrigger>
						</TabsList>
					</section>
					<section className="col-span-2 overflow-y-auto p-4">
						<TabsContent value="audio" className="space-y-6">
							<DeviceSelector
								label="Microphone"
								devices={mediaDevices?.microphones}
								value={selectedMicrophone.deviceId}
								onChange={setSelectedMicrophone}
							/>
							<DeviceSelector
								label="Speaker"
								devices={mediaDevices?.speakers}
								value={selectedSpeaker.deviceId}
								onChange={setSelectedSpeaker}
							/>
						</TabsContent>
						<TabsContent value="video" className="space-y-6">
							<DeviceSelector
								label="Camera"
								devices={mediaDevices?.cameras}
								value={selectedCamera.deviceId}
								onChange={setSelectedCamera}
							/>
						</TabsContent>
					</section>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
};

export default SettingsDialog;
