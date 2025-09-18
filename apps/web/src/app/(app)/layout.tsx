import type { Metadata } from 'next';
import { SocketProvider } from '@/context/SocketContext';
import { WebRTCProvider } from '@/context/WebRTCContext';
import { SocketLayerProvider } from '@/context/SocketLayerContext';
export const metadata: Metadata = {
	title: 'VEDO - Video Call App',
	description: 'This is Video calling App',
	manifest: './manifest.json',
	icons: {
		apple: './icon-512x512.png',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<SocketProvider>
				<WebRTCProvider>
					<SocketLayerProvider>
						<body>{children}</body>
					</SocketLayerProvider>
				</WebRTCProvider>
			</SocketProvider>
		</html>
	);
}
