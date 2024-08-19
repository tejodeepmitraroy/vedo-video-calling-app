'use client';

import { AnimatedTooltip } from '@/components/ui/animated-tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import convertISOTo12HourFormat from '@/utils/ISOFormatconverter';
import { ColumnDef } from '@tanstack/react-table';

interface roomsColumns {
	id: string;
	type: string;
	title: string;
	startTime: Date;
	createdBy: User;
	participants: User[];
}

export const columns: ColumnDef<roomsColumns>[] = [
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
	{
		accessorKey: 'id',
		header: 'Room Id',
	},
	// {
	// 	accessorKey: 'type',
	// 	header: 'Status',
	// },
	{
		accessorKey: 'title',
		header: 'Title',
	},
	{
		accessorKey: 'createdBy',
		header: 'Created By',
		cell: ({ row }) => {
			const user: User = row.getValue('createdBy');

			return (
				<div className="flex items-center gap-2">
					<Avatar className="hidden h-7 w-7 sm:table-cell">
						<AvatarImage src={user.image_url} />
						<AvatarFallback>{user.first_name}</AvatarFallback>
					</Avatar>

					{user.first_name}
				</div>
			);
		},
	},
	{
		accessorKey: 'startTime',
		header: 'Start Date',
		cell: ({ row }) => {
			const startTime: Date = row.getValue('startTime');
			console.log('Column Date=========>', startTime);
			return (
				<div className="flex flex-col gap-2">
					{/* <span>{convertISOTo12HourFormat(startTime!).time}</span> */}
					<span>{convertISOTo12HourFormat(startTime!).date}</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'participants',
		header: 'Participants',
		cell: ({ row }) => {
			const participants: User[] = row.getValue('participants');
			return (
				<div className="flex">
					<AnimatedTooltip
						items={participants.map((item, index) => {
							return {
								id: index,
								name: item.first_name,
								designation: '',
								image: item.image_url,
							};
						})}
					/>
				</div>
			);
		},
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			const payment = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							{/* <DotsHorizontalIcon className="h-4 w-4" /> */}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(payment.id)}
						>
							Copy payment ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>View customer</DropdownMenuItem>
						<DropdownMenuItem>View payment details</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
