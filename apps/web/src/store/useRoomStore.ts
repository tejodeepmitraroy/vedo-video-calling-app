'use client';
import { create } from 'zustand';

interface MediaDevices {
	cameras: MediaDeviceInfo[];
	microphones: MediaDeviceInfo[];
}

interface MeetingDetails {
	createdAt: Date;
	createdById: string;
	description: string | null;
	endTime: Date | null;
	id: string;
	meetingId: string;
	participantIds: string[];
	startTime: Date | null;
	title: string;
	updatedAt: Date;
	videoCallUrl: string;
}

interface useRoomStore {
	roomState: string ;
	roomDetails: MeetingDetails | null;
	setRoomState: (roomState: string ) => void;
	setRoomDetails: (roomDetails: MeetingDetails | null) => void;
}

const useRoomStore = create<useRoomStore>((set, get) => ({
	roomState: 'waitingLobby',
	roomDetails: null,
	setRoomState: (roomState) => set({ roomState }),
	setRoomDetails: (roomDetails) => set({ roomDetails }),
}));

export default useRoomStore;
