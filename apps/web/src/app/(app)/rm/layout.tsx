import { WebRTCProvider } from '@/context/WebRTCContext';
import type { Metadata } from 'next';
import { SocketLayerProvider } from '@/context/SocketLayerContext';
import SidebarWrapper from '@/components/navigation/sidebar/SidebarWrapper';
export const metadata: Metadata = {
	title: 'Room - VEDO',
	description: 'This is Video calling App',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<WebRTCProvider>
			<SocketLayerProvider>
				<SidebarWrapper>{children}</SidebarWrapper>
			</SocketLayerProvider>
		</WebRTCProvider>
	);
}
