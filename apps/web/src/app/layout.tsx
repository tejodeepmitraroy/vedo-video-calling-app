import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { SocketProvider } from '@/context/SocketContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/components/Navbar';
import TopSection from '@/components/TopSection';
import Sidebar from '@/components/Sidebar';
import UserProfile from '@/components/UserProfile';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<ClerkProvider>
				<SocketProvider>
					<body>
						<ToastContainer
							position="top-center"
							autoClose={3000}
							limit={1}
							hideProgressBar={false}
							newestOnTop={false}
							closeOnClick
							rtl={false}
							pauseOnFocusLoss
							draggable
							pauseOnHover
							theme="light"
						/>

						{children}
					</body>
				</SocketProvider>
			</ClerkProvider>
		</html>
	);
}
