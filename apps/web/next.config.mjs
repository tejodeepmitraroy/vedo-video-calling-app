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
	// ignoreDuringBuilds: true,
};

export default nextConfig;
