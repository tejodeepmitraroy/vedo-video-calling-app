'use client';

import useStreamStore from '@/store/useStreamStore';
import dynamic from 'next/dynamic';
import React from 'react';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const ScreenSharePanel = () => {
	const screenStream = useStreamStore((state) => state.localScreenStream);

	return (
		<div className="relative flex  w-full h-full items-center justify-center border-2 border-white bg-black">
			<ReactPlayer
				url={screenStream!}
				playing
				style={{
					position: 'relative',
					aspectRatio: '16/9',
				}}
				width="100%"
				height="100%"
			/>
		</div>
	);
};

export default ScreenSharePanel;
