'use client';
import { create } from 'zustand';

interface MediaDevices {
	cameras: MediaDeviceInfo[];
	microphones: MediaDeviceInfo[];
	speakers: MediaDeviceInfo[];
}
interface DeviceStore {
	mediaDevices: MediaDevices | undefined;
	selectedCamera: string;
	selectedMicrophone: string;
	selectedSpeaker: string;
	setMediaDevices: (mediaDevices: MediaDevices | undefined) => void;
	setSelectedCamera: (devicesId: string) => void;
	setSelectedMicrophone: (devicesId: string) => void;
	setSelectedSpeaker: (devicesId: string) => void;
}

const useDeviceStore = create<DeviceStore>((set) => ({
	mediaDevices: { cameras: [], microphones: [], speakers: [] },
	selectedCamera: '',
	selectedMicrophone: '',
	selectedSpeaker: '',
	setMediaDevices: (mediaDevices) => set({ mediaDevices }),
	setSelectedCamera: (deviceId: string) => set({ selectedCamera: deviceId }),
	setSelectedMicrophone: (deviceId: string) =>
		set({ selectedMicrophone: deviceId }),
	setSelectedSpeaker: (deviceId: string) => set({ selectedSpeaker: deviceId }),
}));

export default useDeviceStore;
