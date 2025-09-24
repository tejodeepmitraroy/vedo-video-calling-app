'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import convertISOTo12HourFormat from '@/utils/ISOFormatconverter';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

export const columns: ColumnDef<RoomDetails>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	// {
	// 	id: 'actions',
	// 	enableHiding: false,
	// 	header: 'Action',
	// 	cell: ({ row }) => {
	// 		const roomId: string = row.getValue('id');

	// 		return (
	// 			<DropdownMenu>
	// 				<DropdownMenuTrigger asChild>
	// 					<Button variant="ghost" className="h-8 w-8 p-0">
	// 						<Play className="h-4 w-4" />
	// 					</Button>
	// 				</DropdownMenuTrigger>
	// 				<DropdownMenuContent align="end">
	// 					<DropdownMenuLabel>Room Actions</DropdownMenuLabel>
	// 					<DropdownMenuItem onClick={() => handleCallOpenMeeting(roomId)}>
	// 						Rejoin
	// 					</DropdownMenuItem>
	// 				</DropdownMenuContent>
	// 			</DropdownMenu>
	// 		);
	// 	},
	// },
	// {
	// 	accessorKey: 'id',
	// 	header: 'Room Id',
	// },

	{
		accessorKey: 'startTime',
		header: 'Date',
		cell: ({ row }) => {
			const startTimeInput = row.original.startTime;
			const endTimeInput = row.original.endTime;

			try {
				const startTime = new Date(startTimeInput);

				if (isNaN(startTime.getTime())) {
					return <div className="flex flex-col gap-2">Invalid Date</div>;
				}

				return (
					<div className="flex flex-col gap-2">
						<span className="font-medium">
							{convertISOTo12HourFormat(startTime).date}{' '}
							{endTimeInput && (
								<>
									-
									{convertISOTo12HourFormat(new Date(endTimeInput)).date ||
										'Ongoing'}
								</>
							)}
						</span>
					</div>
				);
			} catch (error) {
				return <div className="flex flex-col gap-2">Invalid Date</div>;
			}
		},
	},
	{
		accessorKey: 'title',
		header: 'Title',
		cell: ({ row }) => {
			const title: string = row.original.title;
			const roomId: string = row.original.id;
			return (
				<div className="flex flex-col gap-2">
					<div className="text-lg font-medium">{title}</div>
					<div className="flex w-full gap-2">
						<Link href={`/rm/${roomId}`}>
							<Button size={'sm'} variant="default" className="">
								Start
							</Button>
						</Link>
						{/* <Link href={`/rm/${roomId}`} >
							<Button size={'sm'} variant="default">
								Join
							</Button>
						</Link> */}
					</div>
				</div>
			);
		},
	},
	// {
	// 	accessorKey: 'createdBy',
	// 	header: 'Created By',
	// 	cell: ({ row }) => {
	// 		const user: User = row.getValue('createdBy');

	// 		return (
	// 			<div className="flex items-center gap-2">
	// 				<Avatar className="hidden h-7 w-7 sm:table-cell">
	// 					<AvatarImage src={user.image_url} />
	// 					<AvatarFallback>{user.first_name}</AvatarFallback>
	// 				</Avatar>

	// 				{user.first_name}
	// 			</div>
	// 		);
	// 	},
	// },
	// {
	// 	accessorKey: 'participants',
	// 	header: 'Participants',
	// 	cell: ({ row }) => {
	// 		const participants: User[] = row.getValue('participants');
	// 		return (
	// 			<div className="flex">
	// 				<AnimatedTooltip
	// 					items={participants.map((item, index) => {
	// 						return {
	// 							id: index,
	// 							name: item.first_name,
	// 							designation: '',
	// 							image: item.image_url,
	// 						};
	// 					})}
	// 				/>
	// 			</div>
	// 		);
	// 	},
	// },
];
