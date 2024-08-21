import Image from 'next/image';

export default function Loading() {
	// You can add any UI inside Loading, including a Skeleton.
	return (
		<div className="flex h-full w-full items-center justify-center">
			<Image src={'./icon-512x512.png'} width={100} height={100} alt={''} />
		</div>
	);
}
