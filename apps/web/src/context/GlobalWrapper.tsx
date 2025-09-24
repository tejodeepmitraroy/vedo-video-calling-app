'use client';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SocketProvider } from '@/context/SocketContext';
import { WebRTCProvider } from '@/context/WebRTCContext';

const queryClient = new QueryClient();

const GlobalWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<SocketProvider>
				<WebRTCProvider>{children}</WebRTCProvider>
			</SocketProvider>
		</QueryClientProvider>
	);
};

export default GlobalWrapper;
