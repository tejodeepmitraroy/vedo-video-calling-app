import type { Metadata } from 'next';
import SidebarWrapper from '@/components/navigation/sidebar/SidebarWrapper';
import GlobalWrapper from '@/context/GlobalWrapper';

export const metadata: Metadata = {
	title: 'VEDO - Video Call App',
	description: 'This is Video calling App',

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
		<GlobalWrapper>
			<SidebarWrapper>{children}</SidebarWrapper>
		</GlobalWrapper>
	);
}
