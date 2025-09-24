import nextPwa from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'img.clerk.com',
			},
		],
	},
	reactStrictMode: false,
	// typescript: {
	// 	ignoreBuildErrors: true,
	// },
	...nextPwa({
		dest: 'public',
		register: true,
		skipWaiting: true,
	}),
};

export default nextConfig;
