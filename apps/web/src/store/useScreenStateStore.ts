'use client';
import { create } from 'zustand';

interface useScreenStateStore {
	currentScreen: string | null;
	setCurrentScreen: (roomState: string) => void;
}

const useScreenStateStore = create<useScreenStateStore>((set) => ({
	currentScreen: 'Dashboard',
	setCurrentScreen: (currentScreen) => set({ currentScreen }),
}));

export default useScreenStateStore;
