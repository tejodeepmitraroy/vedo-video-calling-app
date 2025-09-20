import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from 'react-hot-toast';
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
		<ClerkProvider
			appearance={{
				elements: {
					formButtonPrimary: 'bg-primary hover:bg-[#f3f4f6] hover:text-black',
				},
			}}
		>
			<html lang="en">
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
			</html>
		</ClerkProvider>
	);
}
