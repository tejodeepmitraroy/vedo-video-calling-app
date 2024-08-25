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
	participants: OnlineUsers[];
	setOnlineUsers: (onlineUsers: OnlineUsers[]) => void;
	setParticipants: (participants: OnlineUsers[]) => void;
}

const useParticipantsStore = create<useParticipantsStore>((set) => ({
	onlineUsers: [],
	participants: [],
	setOnlineUsers: (onlineUsers) => set({ onlineUsers }),
	setParticipants: (participants) => set({ participants }),
}));

export default useParticipantsStore;
