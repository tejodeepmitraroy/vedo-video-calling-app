'use client';
import { useRoomStore } from '@/store/useStreamStore';
import dynamic from 'next/dynamic';
import React, { FC} from 'react';
// import ReactPlayer from 'react-player';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
interface UserVideoPanelProps {
	// stream: MediaStream | null;
	muted: boolean;
}

const UserVideoPanel: FC<UserVideoPanelProps> = ({ muted }) => {
	const stream = useRoomStore((state) => state.stream);
	
	
	

	
	console.log('steam in Video component---->', stream);
	return (
		<div className="relative z-20 flex aspect-[16/9] h-full w-full">
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
					muted={muted}
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
