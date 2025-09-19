'use client';

import { useWebRTC } from '@/context/WebRTCContext';
import useScreenStateStore from '@/store/useScreenStateStore';
import useStreamStore from '@/store/useStreamStore';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect } from 'react';

const OutsideLobby = () => {
	const setCurrentState = useScreenStateStore(
		(state) => state.setCurrentScreen
	);
	const setLocalStream = useStreamStore((state) => state.setLocalStream);
	const { resetRemotePeers } = useWebRTC();
	const stopMediaStream = useCallback(async () => {
		resetRemotePeers();
		setLocalStream(null);
	}, [resetRemotePeers, setLocalStream]);

	const router = useRouter();
	useEffect(() => {
		setTimeout(() => {
			setCurrentState('Waiting Lobby');
			router.push('/');
		}, 2000);

		return () => {
			stopMediaStream();
		};
	}, [router, setCurrentState, setLocalStream, stopMediaStream]);
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
