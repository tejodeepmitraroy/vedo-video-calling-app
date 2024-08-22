'use client';
import { create } from 'zustand';

interface OnlineUsers {
	socketId: string;
	userId: string;
	fullName: string;
	imageUrl: string;
	emailAddress: string;
	host: boolean;
}

interface useParticipantsStore {
	onlineUsers: OnlineUsers[];
	participants: User[];
	setOnlineUsers: (onlineUsers: OnlineUsers[]) => void;
	addParticipant: (participant: User) => void;
	removeParticipant: (participant: User) => void;
}

const useParticipantsStore = create<useParticipantsStore>((set) => ({
	onlineUsers: [],
	participants: [],

	setOnlineUsers: (onlineUsers) => set({ onlineUsers }),
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
