'use client';
import { create } from 'zustand';

interface useScreenStateStore {
	currentScreen: string;
	setCurrentScreen: (roomState: string) => void;
}

const useScreenStateStore = create<useScreenStateStore>((set) => ({
	currentScreen: 'dashboard',
	setCurrentScreen: (currentScreen) => set({ currentScreen }),
}));

export default useScreenStateStore;
