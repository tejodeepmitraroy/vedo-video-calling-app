'use client';
import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';
import { Video } from 'lucide-react';
import { Button } from './ui/button';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';

const formSchema = z.object({
	title: z.string().min(2).max(50),
	description: z.string().min(2).max(50),
	// startTime: z.date(),
	// endTime: z.date(),
	participantIds: z.string().array(),
});

type form = z.infer<typeof formSchema>;

// const convertTo24Hour = (isoString: Date) => {
// 		const date = new Date(isoString); // Create a Date object from the ISO string
// 		const hours = date.getHours().toString().padStart(2, '0'); // Extract hours and pad with '0' if necessary
// 		const minutes = date.getMinutes().toString().padStart(2, '0'); // Extract minutes and pad with '0' if necessary

// 		if (isoString) {
// 			return `${hours}:${minutes}`;
// 		} else {
// 			return '';
// 		}
// 	};

const ScheduleCallForm = () => {
	const { getToken } = useAuth();
	const form = useForm<form>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			description: '',

			participantIds: [''],
		},
	});

	async function onSubmit({
		title,
		description,
		// startTime,
		// endTime,
		participantIds,
	}: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log({ title, description, participantIds });
		const token = await getToken();
		try {
			const { data } = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/schedule`,
				{
					title,
					description,
					participantIds,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant={'outline'}
					className="flex w-full items-center justify-center gap-3 border py-10 text-center text-base shadow-sm hover:text-primary"
				>
					<Video />
					Create a Room for later
				</Button>
			</DialogTrigger>
			<DialogContent className="">
				<DialogHeader>
					<DialogTitle>Create a Room for later</DialogTitle>
					<DialogDescription>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-8"
							>
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Username</FormLabel>
											<FormControl>
												<Input placeholder="Username" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Textarea placeholder="Description" {...field} />
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								{/* <FormField
									control={form.control}
									name="startTime"
									render={({ field }) => (
										<FormItem className="flex flex-col">
											<FormLabel>Date of birth</FormLabel>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant={'outline'}
															className={cn(
																'w-[240px] pl-3 text-left font-normal',
																!field.value && 'text-muted-foreground'
															)}
														>
															{field.value ? (
																format(field.value, 'PPP')
															) : (
																<span>Pick a date</span>
															)}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent
													className="z-[60] w-auto border border-black p-0"
													align="start"
												>
													<Calendar
														mode="single"
														selected={field.value}
														onSelect={field.onChange}
														disabled={(date) =>
															date > new Date() || date < new Date('1900-01-01')
														}
														initialFocus
													/>
												</PopoverContent>
											</Popover>

											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="endTime"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>End Time</FormLabel>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant={'outline'}
															className={cn(
																'w-full pl-3 text-left font-normal',
																!field.value && 'text-muted-foreground'
															)}
														>
															{field.value ? (
																format(field.value, 'PPP')
															) : (
																<span>Pick a date</span>
															)}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0" align="start">
													<Calendar
														mode="single"
														selected={field.value}
														onSelect={field.onChange}
														disabled={(date) =>
															date > new Date() || date < new Date('1900-01-01')
														}
														initialFocus
													/>
												</PopoverContent>
											</Popover>

											<FormMessage />
										</FormItem>
									)}
								/> */}

								<Button type="submit">Submit</Button>
							</form>
						</Form>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default ScheduleCallForm;
