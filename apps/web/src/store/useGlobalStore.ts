'use client';
import { create } from 'zustand';

interface useGlobalStore {
	friendList: FriendListResponse[] | null;
	roomDetails: MeetingDetails | RoomDetails | null;
	onLineStatus: boolean;

	setFriendList: (roomState: FriendListResponse[]) => void;
	setRoomDetails: (roomDetails: MeetingDetails | RoomDetails | null) => void;
	setOnLineStatus: (onLineStatus: boolean) => void;
}

const useGlobalStore = create<useGlobalStore>((set) => ({
	friendList: null,
	roomDetails: null,
	onLineStatus: false,
	setFriendList: (friendList) => set({ friendList }),
	setRoomDetails: (roomDetails) => set({ roomDetails }),
	setOnLineStatus: (onLineStatus: boolean) => set({ onLineStatus }),
}));

export default useGlobalStore;
