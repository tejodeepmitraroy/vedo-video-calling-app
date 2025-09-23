'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface useScreenStateStore {
	currentScreen: 'Waiting Lobby' | 'Meeting Room' | 'Outside Lobby' | null;
	setCurrentScreen: (
		roomState: 'Waiting Lobby' | 'Meeting Room' | 'Outside Lobby'
	) => void;
}

const useScreenStateStore = create<useScreenStateStore>()(
	devtools((set) => ({
		currentScreen: 'Waiting Lobby',
		setCurrentScreen: (roomState) =>
			set(
				{ currentScreen: roomState },
				false,
				'setCurrentScreen - ' + roomState
			),
	}))
);

export default useScreenStateStore;
