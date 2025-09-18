'use client';
import React from 'react';
import AppSidebar from './app-sidebar';
import NavBar from '../Navbar';
import BottomNavigation from '../BottomNavigation';
import useScreenStateStore from '@/store/useScreenStateStore';

const SidebarWrapper = ({ children }: { children: React.ReactNode }) => {
	const currentScreen = useScreenStateStore((state) => state.currentScreen);
	return (
		<div
			className={
				` ${currentScreen === 'Meeting Room' && 'hidden'} mx-auto flex h-screen w-full flex-1 flex-col bg-gray-100 dark:bg-neutral-800 md:flex-row` // for your use case, use `h-screen` instead of `h-[60vh]`
			}
		>
			<AppSidebar />

			<div className="h-full w-full bg-background md:pb-[50px]">
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
