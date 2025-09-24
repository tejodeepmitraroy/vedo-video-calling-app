'use client';
import React from 'react';

import { useAuth } from '@clerk/nextjs';
import { DataTable } from '@/features/meetings/components/data-table';
import { columns } from '@/features/meetings/components/columns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAllRoomDetails } from '@/features/meetings/services';
import { useQuery } from '@tanstack/react-query';

const Conference = () => {
	const { getToken } = useAuth();

	const roomDetails = async () => {
		const token = await getToken();
		const response = await getAllRoomDetails(token);
		return response;
	};

	const { data, isLoading, error } = useQuery({
		queryKey: ['all-scheduled-rooms-details'],
		queryFn: () => roomDetails(),
	});

	return (
		<section className="flex h-full w-full flex-col items-start justify-start px-4 md:flex-1">
			<section className="flex w-full items-start justify-start p-4">
				<h1 className="text-3xl font-bold">Meetings</h1>
			</section>
			<section className="flex h-full w-full items-center justify-center md:flex-1">
				{isLoading ? (
					<p>Loading...</p>
				) : error ? (
					<p>Error: {error.message}</p>
				) : (
					<ScrollArea className="flex h-full w-full flex-1">
						<DataTable columns={columns} data={data!} />
					</ScrollArea>
				)}
				{/* <div className="flex h-full w-full md:hidden md:flex-1">
				<div className="bg-card text-card-foreground m-4 mx-auto flex h-full w-full max-w-7xl flex-col gap-5 rounded-lg">
					<DataTable columns={columns} data={data} />
				</div>
				{/* <MeetingsList meetings={allScheduledRoomsDetails} /> 
				</div> */}
			</section>
		</section>
	);
};

export default Conference;
