'use client';
import React from 'react';
import Sidebar from './Sidebar';
import NavBar from './Navbar';
import BottomNavigation from './BottomNavigation';

const Navigation = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<div className="grid h-screen w-full bg-primary md:pl-[55px]">
			<Sidebar />
			<div className="flex flex-col">
				<NavBar />
				{children}
			</div>
			<BottomNavigation />
		</div>
	);
};

export default Navigation;
