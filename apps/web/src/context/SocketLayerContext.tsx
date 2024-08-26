'use client';

import {
	createContext,
	useContext,
	ReactNode,
	useEffect,
	useCallback,
} from 'react';
import React from 'react';
import { useSocket } from './SocketContext';
import { useAuth, useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import useGlobalStore from '@/store/useGlobalStore';
import useParticipantsStore from '@/store/useParticipantsStore';
import { useWebRTC } from './WebRTCContext';
import useStreamStore from '@/store/useStreamStore';
import useScreenStateStore from '@/store/useScreenStateStore';

interface ISocketLayerContext {}

const SocketLayerContext = createContext<ISocketLayerContext | null>(null);

export const useSocketLayer = () => {
	const state = useContext(SocketLayerContext);
	if (!state) throw new Error('state is undefined');
	return state;
};

export const SocketLayerProvider = ({ children }: { children: ReactNode }) => {
	const { userId } = useAuth();
	const { user } = useUser();
	const setOnLineStatus = useGlobalStore((state) => state.setOnLineStatus);
	const { socket, socketOn, socketOff, socketEmit } = useSocket();
	const setOnlineUsers = useParticipantsStore((state) => state.setOnlineUsers);
	const setLocalStream = useStreamStore((state) => state.setLocalStream);
	const setCurrentScreen = useScreenStateStore(
		(state) => state.setCurrentScreen
	);
	// const removeParticipant = useParticipantsStore(
	// 	(state) => state.removeParticipant
	// );

	const { disconnectPeer, resetRemotePeers } = useWebRTC();

	/////////////////////////////////////////////////////////////////////////////////////
	// Connection with Server notification👇

	const handleConnectingServer = useCallback(() => {
		if (user && socket) {
			toast.loading('Connecting with server');
			socketEmit('event:connectWithServer', {
				userId: user.id,
				fullName: user.fullName,
				imageUrl: user.imageUrl,
				emailAddress: user.emailAddresses[0]
					? user.emailAddresses[0].emailAddress
					: '',
			});
		}
	}, [socket, socketEmit, user]);

	const handleUserConnected = useCallback(() => {
		if (socket) {
			if (socket.connected) {
				toast.dismiss();
				toast.success('Connected');

				setOnLineStatus(true);
			} else {
				toast.error('Not Connected');
				setOnLineStatus(false);
			}
		} else {
			toast.loading('Connecting with server');
		}
	}, [setOnLineStatus, socket]);

	const handleGetOnlineUser = useCallback(
		({ users }: { users: ServerStoreUser[] }) => {
			setOnlineUsers(users);
		},
		[setOnlineUsers]
	);

	useEffect(() => {
		handleConnectingServer();
	}, [handleConnectingServer]);

	useEffect(() => {
		socketOn('event:getOnlineUsers', handleGetOnlineUser);
		socketOn('event:userConnected', handleUserConnected);
		return () => {
			socketOff('event:getOnlineUsers', handleGetOnlineUser);
			socketOff('event:userConnected', handleUserConnected);
		};
	}, [handleGetOnlineUser, handleUserConnected, socketOff, socketOn]);

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	////// Conference Rooms all Socket  Notification Function👇

	const handleInformAllNewUserAdded = useCallback(
		({ userId: id, username }: { userId: string; username: string }) => {
			if (id === userId) {
				toast.success(`successfully joined`);
			} else {
				toast(`${username} Joined`);
			}
		},
		[userId]
	);

	const handleUserLeftTheRoom = useCallback(
		({ user }: { user: ServerStoreUser }) => {
			if (user.userId === userId) {
				toast.success(`You Left the Room`);
				setLocalStream(null);
				resetRemotePeers();
				setCurrentScreen('OutSide Lobby');
			} else {
				disconnectPeer({ user });
				// removeParticipant(user);
				toast(`${user.fullName} Left the Room`);
			}
		},
		[disconnectPeer, resetRemotePeers, setCurrentScreen, setLocalStream, userId]
	);

	const handleRemoveEveryoneFromRoom = useCallback(async () => {
		toast(`Host End the Room`);
		resetRemotePeers();
		setCurrentScreen('OutSide Lobby');
	}, [resetRemotePeers, setCurrentScreen]);

	const handleUserKickedFromTheRoom = useCallback(
		({ user }: { user: ServerStoreUser }) => {
			if (user.userId === userId) {
				toast.success(`You Left the Room`);
				setLocalStream(null);
				resetRemotePeers();
				setCurrentScreen('OutSide Lobby');
			} else {
				disconnectPeer({ user });
				toast(`${user.fullName} is kicked from the Room`);
			}
		},
		[disconnectPeer, resetRemotePeers, setCurrentScreen, setLocalStream, userId]
	);

	const handleHostIsChanged = useCallback(
		({ user }: { user: ServerStoreUser }) => {
			toast(`${user.fullName} is now host of the Room`);
		},
		[]
	);

	///////////////////////////////////////////////////////
	////// Listener 👇

	useEffect(() => {
		socketOn('notification:informAllNewUserAdded', handleInformAllNewUserAdded);
		socketOn('notification:userLeftTheRoom', handleUserLeftTheRoom);
		socketOn('event:removeEveryoneFromRoom', handleRemoveEveryoneFromRoom);
		socketOn('notification:userKickedFromTheRoom', handleUserKickedFromTheRoom);
		socketOn('notification:hostIsChanged', handleHostIsChanged);

		return () => {
			socketOff(
				'notification:informAllNewUserAdded',
				handleInformAllNewUserAdded
			);
			socketOff('event:removeEveryoneFromRoom', handleRemoveEveryoneFromRoom);
			socketOff('notification:userLeftTheRoom', handleUserLeftTheRoom);
			socketOff(
				'notification:userKickedFromTheRoom',
				handleUserKickedFromTheRoom
			);
			socketOff('notification:hostIsChanged', handleHostIsChanged);
		};
	}, [
		handleHostIsChanged,
		handleInformAllNewUserAdded,
		handleRemoveEveryoneFromRoom,
		handleUserKickedFromTheRoom,
		handleUserLeftTheRoom,
		socketOff,
		socketOn,
	]);

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	return (
		<SocketLayerContext.Provider value={{}}>
			{children}
		</SocketLayerContext.Provider>
	);
};
