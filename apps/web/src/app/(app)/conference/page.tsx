'use client';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { DataTable } from '@/features/confererence/components/data-table';
import { columns } from '@/features/confererence/components/columns';
import { ScrollArea } from '@/components/ui/scroll-area';

const Conference = () => {
	const { getToken } = useAuth();

	const [allScheduledRoomsDetails, setAllScheduledRoomsDetails] = useState<
		RoomDetails[]
	>([]);

	///////////////////////////////////////////////////////////////////////////////////////////

	const getAllRoomDetails = useCallback(async () => {
		const token = await getToken();

		try {
			const { data } = await axios(
				`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/room`,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (data.data.length !== 0) {
				setAllScheduledRoomsDetails(data.data);
			}
		} catch (error) {
			console.log(error);
		}
	}, [getToken]);

	useEffect(() => {
		getAllRoomDetails();
	}, [getAllRoomDetails]);

	return (
		<>
			<ScrollArea className="hidden h-full w-full px-4 md:flex md:flex-1">
				<div className="m-4 mx-auto flex h-full w-full max-w-7xl flex-col gap-5 rounded-lg bg-card bg-slate-100 p-5 text-card-foreground">
					<DataTable columns={columns} data={allScheduledRoomsDetails} />
				</div>
			</ScrollArea>
			<div className="flex h-full w-full px-4 md:hidden md:flex-1">
				<div className="m-4 mx-auto flex w-full max-w-7xl flex-col gap-5 rounded-lg bg-card bg-slate-100 p-5 text-card-foreground">
					<DataTable columns={columns} data={allScheduledRoomsDetails} />
				</div>
			</div>
		</>
	);
};

export default Conference;
