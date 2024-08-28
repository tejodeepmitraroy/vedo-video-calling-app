'use client';

import useStreamStore from '@/store/useStreamStore';
import dynamic from 'next/dynamic';
import React from 'react';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const ScreenSharePanel = () => {
	const screenStream = useStreamStore((state) => state.localScreenStream);

	return (
		<div className="relative z-20 flex h-full w-full flex-col">
			{/* <div className=" absolute w-full border border-white">dwada </div> */}
			<div className="flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl bg-[#3c4043]">
				<ReactPlayer
					url={screenStream!}
					playing
					style={{
						position: 'relative',
						top: '0',
						left: '0',
						width: '100%',
						height: '100%',
						objectFit: 'contain',
					}}
					width={'100%'}
					height={'100%'}
				/>
			</div>
		</div>
	);
};

export default ScreenSharePanel;
