import { useSocket } from '@/context/SocketContext';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const useNotificationSocket = () => {
	const { socketOn, socketOff } = useSocket();
	const [askToEnterLoading, setAskToEnterLoading] = useState(false);

	/////// All socket Notification Function are Define Here
	const roomEnterPermissionDenied = useCallback(() => {
		setAskToEnterLoading(false);
		toast.error("Sorry host don't want to enter you");
	}, [setAskToEnterLoading]);

	const handleHostIsNotExistedInRoom = useCallback(() => {
		setAskToEnterLoading(false);
		toast.error(`Host is Not Existed in Room. Please wait`);
	}, [setAskToEnterLoading]);

	const handleRoomLimitFull = useCallback(() => {
		setAskToEnterLoading(false);
		toast.error(`Room Limit Full`);
	}, [setAskToEnterLoading]);

	////////////////////////////////////////////////////////////////////////////////////////////////////
	useEffect(() => {
		socketOn(
			'notification:hostIsNotExistedInRoom',
			handleHostIsNotExistedInRoom
		);
		socketOn(
			'notification:roomEnterPermissionDenied',
			roomEnterPermissionDenied
		);
		socketOn('notification:roomLimitFull', handleRoomLimitFull);
		return () => {
			socketOff(
				'notification:hostIsNotExistedInRoom',
				handleHostIsNotExistedInRoom
			);
			socketOff(
				'notification:roomEnterPermissionDenied',
				roomEnterPermissionDenied
			);
			socketOff('notification:roomLimitFull', handleRoomLimitFull);
		};
	}, [
		handleHostIsNotExistedInRoom,
		handleRoomLimitFull,
		roomEnterPermissionDenied,
		socketOff,
		socketOn,
	]);

	return {
		askToEnterLoading,
        
	};
};

export default useNotificationSocket;
