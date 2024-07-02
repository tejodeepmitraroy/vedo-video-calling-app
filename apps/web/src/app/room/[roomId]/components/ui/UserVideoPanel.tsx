'use client';
import dynamic from 'next/dynamic';
import React, { FC } from 'react';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
interface UserVideoPanelProps {
	stream: MediaStream | null;
	muted: boolean;
}

const UserVideoPanel: FC<UserVideoPanelProps> = ({ stream, muted }) => {
	console.log("steam in Video component---->",stream);
	return (
		<div className=" relative overflow-hidden aspect-video flex h-full w-full items-center justify-center rounded-xl bg-black">
		{/* <div className=" relative flex h-full w-full items-center justify-center rounded-xl border-2 border-red-500 bg-black"> */}
			<ReactPlayer
				url={stream!}
				playing
				style={{
					position: 'absolute',
					top: '0',
					left: '0',
					width: '100%',
					height: '100%',
					objectFit: "contain",
					
				}}
				muted={muted}
				width={'100%'}
				height={'100%'}
			/>
			{/* <div className="absolute bottom-2 right-2 rounded-3xl bg-white px-3 py-1 text-[1.4vw] font-semibold">
				Tejodeep Mitra Roy
			</div> */}
		</div>
	);
};

export default UserVideoPanel;
