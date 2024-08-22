'use client';

import dynamic from 'next/dynamic';
import React, { FC } from 'react';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface RemoteUserVideoPanelProps {
	stream: MediaStream;
}
const RemoteUserVideoPanel: FC<RemoteUserVideoPanelProps> = ({ stream }) => {
	// const { getRemoteStream } = useWebRTC();
	// const remoteStream = getRemoteStream();

	console.log('REMOTE STREAM ====>', stream);

	return (
		<div className="relative z-20 flex h-full w-full">
			<div className="z-30 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl bg-black">
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
			</div>
		</div>
	);
};

export default RemoteUserVideoPanel;
