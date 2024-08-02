'use client';
import { create } from 'zustand';

interface useRoomStore {
	roomState: string;

	setRoomState: (roomState: string) => void;
}

const useRoomStore = create<useRoomStore>((set) => ({
	roomState: 'waitingLobby',

	setRoomState: (roomState) => set({ roomState }),
}));

export default useRoomStore;
