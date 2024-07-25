'use client';
import useRoomStore from '@/store/useRoomStore';
import useScreenStateStore from '@/store/useScreenStateStore';
import React, { useEffect } from 'react';

const OutsideLobby = () => {
	const setRoomState = useRoomStore((state) => state.setRoomState);
	const setCurrentState = useScreenStateStore(
		(state) => state.setCurrentScreen
	);

	useEffect(() => {
		setTimeout(() => {
			setRoomState('waitingLobby');
			setCurrentState('Dashboard');
		}, 2000);
	}, [setCurrentState, setRoomState]);
	return (
		<div className="flex flex-1 rounded-lg bg-background p-4">
			<div className="flex w-full flex-col items-center justify-center gap-5 rounded-lg p-5">
				<div className="flex flex-col items-center justify-center gap-3">
					<div className="flex items-center">
						<h2 className="text-3xl font-bold tracking-tight">
							This is OutSide
						</h2>
					</div>
					<div className="text-xl font-medium">
						<h4>Thanks to using VEDO APP</h4>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OutsideLobby;
