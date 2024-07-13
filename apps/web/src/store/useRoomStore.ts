'use client';
import { create } from 'zustand';



interface useRoomStore {
	roomState: string;
	roomDetails: MeetingDetails | null;
	setRoomState: (roomState: string) => void;
	setRoomDetails: (roomDetails: MeetingDetails | null) => void;
}

const useRoomStore = create<useRoomStore>((set, get) => ({
	roomState: 'waitingLobby',
	roomDetails: null,
	setRoomState: (roomState) => set({ roomState }),
	setRoomDetails: (roomDetails) => set({ roomDetails }),
}));

export default useRoomStore;
