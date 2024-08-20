'use client';
import { create } from 'zustand';

interface useParticipantsStore {
	participants: User[];
	addParticipant: (participant: User) => void;
	removeParticipant: (participant: User) => void;
}

const useParticipantsStore = create<useParticipantsStore>((set) => ({
	participants: [],
	addParticipant: (participant) =>
		set((state) => ({ participants: [...state.participants, participant] })),
	removeParticipant: (participant) =>
		set((state) => ({
			participants: state.participants.filter(
				(item) => item.id === participant.id
			),
		})),
}));

export default useParticipantsStore;
