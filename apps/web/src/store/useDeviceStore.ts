'use client';
import { create } from 'zustand';

interface MediaDevices {
	cameras: MediaDeviceInfo[];
	microphones: MediaDeviceInfo[];
}
interface DeviceStore {
	mediaDevices: MediaDevices | undefined;
	selectedCamera: string;
	selectedMicrophone: string;
	setMediaDevices: (mediaDevices: MediaDevices | undefined) => void;
	setSelectedCamera: (devicesId: string) => void;
	setSelectedMicrophone: (devicesId: string) => void;
}

const useDeviceStore = create<DeviceStore>((set) => ({
	mediaDevices: { cameras: [], microphones: [] },
	selectedCamera: '',
	selectedMicrophone: '',
	setMediaDevices: (mediaDevices) => set({ mediaDevices }),
	setSelectedCamera: (deviceId: string) => set({ selectedCamera: deviceId }),
	setSelectedMicrophone: (deviceId: string) =>
		set({ selectedMicrophone: deviceId }),
}));

export default useDeviceStore;
