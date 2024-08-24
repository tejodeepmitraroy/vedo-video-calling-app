'use client';

import dynamic from 'next/dynamic';
import React, { FC, useEffect, useState } from 'react';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface RemoteUserVideoPanelProps {
	stream: MediaStream;
}
const RemoteUserVideoPanel: FC<RemoteUserVideoPanelProps> = ({ stream }) => {
	const [hasWindow, setHasWindow] = useState(false);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setHasWindow(true);
		}
	}, []);

	return (
		<div className="relative z-20 flex h-full w-full">
			<div className="z-30 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl bg-black">
				{hasWindow && (
					<ReactPlayer
						url={stream!}
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
				)}
			</div>
		</div>
	);
};

export default RemoteUserVideoPanel;
