'use client';
import { create } from 'zustand';

interface MediaDevices {
	cameras: MediaDeviceInfo[];
	microphones: MediaDeviceInfo[];
	speakers: MediaDeviceInfo[];
}
interface DeviceStore {
	mediaDevices: MediaDevices | undefined;
	selectedCamera: { label: string; deviceId: string };
	selectedMicrophone: { label: string; deviceId: string };
	selectedSpeaker: { label: string; deviceId: string };
	setMediaDevices: (mediaDevices: MediaDevices) => void;
	setSelectedCamera: (devicesId: string) => void;
	setSelectedMicrophone: (devicesId: string) => void;
	setSelectedSpeaker: (devicesId: string) => void;
}

const useDeviceStore = create<DeviceStore>((set, get) => ({
	mediaDevices: { cameras: [], microphones: [], speakers: [] },
	selectedCamera: { label: 'Select Camera', deviceId: '' },
	selectedMicrophone: { label: 'Select Microphone', deviceId: '' },
	selectedSpeaker: { label: 'Select Speaker', deviceId: '' },
	setMediaDevices: (mediaDevices: MediaDevices) => {
		const updates: Partial<DeviceStore> = { mediaDevices };
		const currentState = get();

		if (
			!currentState.selectedCamera?.deviceId &&
			mediaDevices.cameras.length > 0
		) {
			updates.selectedCamera = {
				label: mediaDevices.cameras[0].label,
				deviceId: mediaDevices.cameras[0].deviceId,
			};
		}

		if (
			!currentState.selectedMicrophone?.deviceId &&
			mediaDevices.microphones.length > 0
		) {
			updates.selectedMicrophone = {
				label: mediaDevices.microphones[0].label,
				deviceId: mediaDevices.microphones[0].deviceId,
			};
		}

		if (
			!currentState.selectedSpeaker?.deviceId &&
			mediaDevices.speakers.length > 0
		) {
			updates.selectedSpeaker = {
				label: mediaDevices.speakers[0].label,
				deviceId: mediaDevices.speakers[0].deviceId,
			};
		}
		set(updates);
	},
	setSelectedCamera: (
		devicesId: string | { label: string; deviceId: string }
	) =>
		set({
			selectedCamera:
				typeof devicesId === 'string'
					? get().mediaDevices?.cameras.find(
							(camera) => camera.deviceId === devicesId
						) || { label: '', deviceId: devicesId }
					: devicesId,
		}),
	setSelectedMicrophone: (
		devicesId: string | { label: string; deviceId: string }
	) =>
		set({
			selectedMicrophone:
				typeof devicesId === 'string'
					? get().mediaDevices?.microphones.find(
							(microphone) => microphone.deviceId === devicesId
						) || { label: '', deviceId: devicesId }
					: devicesId,
		}),
	setSelectedSpeaker: (
		devicesId: string | { label: string; deviceId: string }
	) =>
		set({
			selectedSpeaker:
				typeof devicesId === 'string'
					? get().mediaDevices?.speakers.find(
							(speaker) => speaker.deviceId === devicesId
						) || { label: '', deviceId: devicesId }
					: devicesId,
		}),
}));

export default useDeviceStore;
