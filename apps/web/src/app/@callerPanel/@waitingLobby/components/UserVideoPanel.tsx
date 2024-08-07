'use client';

import useStreamStore from '@/store/useStreamStore';
import dynamic from 'next/dynamic';
import React from 'react';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const UserVideoPanel = () => {
	const localStream = useStreamStore((state) => state.localStream);

	return (
		<div className="relative z-20 flex aspect-[16/9] h-full w-full">
			<div className="z-30 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl bg-black">
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

				{/* <div className="absolute bottom-2 right-2 rounded-3xl bg-white px-3 py-1 text-[1.4vw] font-semibold">
				Tejodeep Mitra Roy
				</div> */}
			</div>
		</div>
	);
};

export default UserVideoPanel;
