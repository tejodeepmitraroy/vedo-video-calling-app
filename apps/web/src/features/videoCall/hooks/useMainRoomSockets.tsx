import useGlobalStore from '@/store/useGlobalStore';
import { useAuth } from '@clerk/nextjs';
import React, { useCallback, useEffect } from 'react';
import { getRoomDetails } from '../services';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSocket } from '@/context/SocketContext';

const useMainRoomSockets = (roomId: string) => {
	const {
		// socketOn, socketOff,
		socketEmit,
	} = useSocket();

	const { getToken, userId } = useAuth();
	const router = useRouter();
	const setRoomDetails = useGlobalStore((state) => state.setRoomDetails);

	const roomDetailsFetch = useCallback(async () => {
		const token = await getToken();

		try {
			const response = await getRoomDetails(token, roomId);

			console.log('roomDetails--------->', response);

			/////////////////////////////////////////////////////////////////////////////
			const checkJoinedRoom = response.createdBy.id === userId;

			socketEmit('event:checkPreviouslyJoinedRoom', {
				roomId,
				hostUser: checkJoinedRoom,
			});

			if (response) {
				setRoomDetails(response);
			} else {
				router.push('/');
			}
		} catch (error) {
			console.error('Error fetching room details:', error);
			toast.error('Failed to fetch room details');
			router.push('/');
		}
	}, [getToken, roomId, router, setRoomDetails, socketEmit, userId]);

	useEffect(() => {
		roomDetailsFetch();
	}, [roomDetailsFetch]);

	return <div></div>;
};

export default useMainRoomSockets;
