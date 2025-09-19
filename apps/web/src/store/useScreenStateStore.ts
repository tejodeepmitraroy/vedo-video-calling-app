'use client';
import { create } from 'zustand';

interface useScreenStateStore {
	currentScreen: 'Waiting Lobby' | 'Meeting Room' | 'Outside Lobby' | null;
	setCurrentScreen: (
		roomState: 'Waiting Lobby' | 'Meeting Room' | 'Outside Lobby'
	) => void;
}

const useScreenStateStore = create<useScreenStateStore>((set) => ({
	currentScreen: 'Waiting Lobby',
	setCurrentScreen: (currentScreen) => set({ currentScreen: currentScreen }),
}));

export default useScreenStateStore;
