import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HomeIcon, Laptop } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import UserProfile from '@/features/auth/components/UserProfile';
import { usePathname } from 'next/navigation';

const AppSidebar = () => {
	const [open, setOpen] = useState<boolean>(false);
	const { user } = useUser();

	const navItems: Array<{
		label: string;
		href: string;
		icon: React.ReactNode;
		items?: Array<{ label: string; href: string }>;
	}> = [
		{
			label: 'Dashboard',
			href: '/',
			icon: (
				<HomeIcon className="h-6 w-6 flex-shrink-0 dark:text-neutral-200" />
			),
		},
		{
			label: 'Conference',
			href: '/conference',
			icon: <Laptop className="h-6 w-6 flex-shrink-0 dark:text-neutral-200" />,
		},
	];

	const pathname = usePathname();

	return (
		<Sidebar open={open} setOpen={setOpen}>
			<SidebarBody className="justify-between gap-10">
				<div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
					<>
						<Logo />
					</>
					<div className="mt-8 flex flex-col gap-2">
						{navItems.map((screen, idx) => (
							<SidebarLink
								key={idx}
								link={{
									label: screen.label,
									href: screen.href,
									icon: screen.icon,
									active: pathname === screen.href,
								}}
							/>
						))}
					</div>
				</div>
				<div>
					<SidebarLink
						className="pl-2"
						link={{
							label: user?.fullName ? user.fullName : '',
							href: '#',
							icon: <UserProfile />,
						}}
					/>
				</div>
			</SidebarBody>
		</Sidebar>
	);
};

export default AppSidebar;

export const Logo = () => {
	return (
		<Link
			href=""
			className="relative z-20 flex items-center space-x-2 py-1 pl-2 text-sm font-normal text-black"
		>
			<Image
				src="/icon-512x512.png"
				className="h-7 w-7 flex-shrink-0 rounded-full"
				width={50}
				height={50}
				alt="Avatar"
			/>

			<motion.span
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="whitespace-pre font-medium text-black dark:text-white"
			>
				VEDO - Video CAll
			</motion.span>
		</Link>
	);
};
