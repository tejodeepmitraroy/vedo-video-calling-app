'use client';
import useStreamStore from '@/store/useStreamStore';

import dynamic from 'next/dynamic';
import React from 'react';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const UserVideoPanel = () => {
	const localStream = useStreamStore((state) => state.localStream);

	return (
		<div className="relative z-20 flex h-full w-full rounded-xl">
			{/* <div className="relative z-20 flex aspect-[16/9] h-full  w-full"> */}
			<div className="relative z-30 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl bg-[#3c4043]">
				<ReactPlayer
					url={localStream!}
					playing
					style={{
						position: 'relative',
						top: '0',
						left: '0',
						width: '100%',
						height: '100%',
						objectFit: 'contain',
					}}
					muted={true}
					width={'100%'}
					height={'100%'}
				/>
			</div>
		</div>
	);
};

export default UserVideoPanel;
