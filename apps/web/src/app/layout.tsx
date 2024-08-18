import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { SocketProvider } from '@/context/SocketContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { TooltipProvider } from '@/components/ui/tooltip';
import { WebRTCProvider } from '@/context/WebRTCContext';
import { neobrutalism } from '@clerk/themes';

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
				appearance={{
					baseTheme: neobrutalism,
				}}
			>
				<SocketProvider>
					<WebRTCProvider>
						<body>
							<TooltipProvider>
								<ToastContainer
									position="top-center"
									limit={2}
									autoClose={2000}
									hideProgressBar={false}
									newestOnTop={false}
									closeOnClick
									rtl={false}
									pauseOnFocusLoss={false}
									draggable
									pauseOnHover={false}
									theme="light"
								/>
								{children}
							</TooltipProvider>
						</body>
					</WebRTCProvider>
				</SocketProvider>
			</ClerkProvider>
		</html>
	);
}
