import type { Metadata } from 'next';
import { SocketLayerProvider } from '@/context/SocketLayerContext';

export const metadata: Metadata = {
	title: 'Room - VEDO',
	description: 'This is Video calling App',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <SocketLayerProvider>{children}</SocketLayerProvider>;
}
