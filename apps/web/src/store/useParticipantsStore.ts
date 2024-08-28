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
interface Participant {
	socketId: string;
	userId: string;
	fullName: string;
	imageUrl: string;
	emailAddress: string;
	host: boolean;
	stream: MediaStream;
}

interface useParticipantsStore {
	onlineUsers: OnlineUsers[];
	participants: Participant[];
	setOnlineUsers: (onlineUsers: OnlineUsers[]) => void;
	setParticipants: (participants: Participant[]) => void;
}

const useParticipantsStore = create<useParticipantsStore>((set) => ({
	onlineUsers: [],
	participants: [],
	setOnlineUsers: (onlineUsers) => set({ onlineUsers }),
	setParticipants: (participants) => set({ participants }),
}));

export default useParticipantsStore;
