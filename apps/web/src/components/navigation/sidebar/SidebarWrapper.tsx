'use client';
import React from 'react';
import AppSidebar from './app-sidebar';
import NavBar from '../Navbar';
import BottomNavigation from '../BottomNavigation';

const SidebarWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<div
			className={
				`mx-auto flex h-dvh w-full flex-1 flex-col bg-gray-100 md:flex-row dark:bg-neutral-800` // for your use case, use `h-screen` instead of `h-[60vh]`
			}
		>
			<AppSidebar />

			<div className="bg-background h-full w-full md:pb-[50px]">
				<NavBar />
				<div className="flex h-full w-full flex-col justify-between">
					{children}
					<BottomNavigation />
				</div>
			</div>
		</div>
	);
};

export default SidebarWrapper;
