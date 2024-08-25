import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { SocketProvider } from '@/context/SocketContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { WebRTCProvider } from '@/context/WebRTCContext';
import { Toaster } from 'react-hot-toast';
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
			<ClerkProvider
			// appearance={{
			// 	baseTheme: neobrutalism,
			// }}
			>
				<SocketProvider>
					<WebRTCProvider>
						<SocketLayerProvider>
							<body>
								<TooltipProvider>
									<Toaster
										position="top-center"
										reverseOrder={false}
										gutter={8}
										toastOptions={{
											duration: 5000,
											style: {
												background: '#363636',
												color: '#fff',
											},
										}}
									/>
									{children}
								</TooltipProvider>
							</body>
						</SocketLayerProvider>
					</WebRTCProvider>
				</SocketProvider>
			</ClerkProvider>
		</html>
	);
}
