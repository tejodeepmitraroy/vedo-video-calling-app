'use client';
import dynamic from 'next/dynamic';
import React, { FC } from 'react';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
interface UserVideoPanelProps {
	stream: MediaStream | null;
	muted: boolean;
}

const UserVideoPanel: FC<UserVideoPanelProps> = ({ stream, muted }) => {
	return (
		<ReactPlayer
			url={stream!}
			playing
			muted={muted}
			style={{
				position: 'relative',
				aspectRatio: '16/9',
				border: '2px solid white',
			}}
			width={'100%'}
		/>
	);
};

export default UserVideoPanel;
