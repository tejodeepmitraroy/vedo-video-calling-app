'use client';
import React, { useEffect, useState } from 'react';

const DashboardClock = () => {
	const [currentTime, setCurrentTime] = useState(new Date());
	// Update time every second
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	// Format time as HH:MM:SS AM/PM
	const formatTime = (date: Date) => {
		return date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: true,
		});
	};

	// Format date as Weekday, Month Day, Year
	const formatDate = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		});
	};

	return (
		<div className="w-full">
			<section className="text-2xl font-bold">
				{formatTime(currentTime)}
			</section>
			<section className="text-white/90">{formatDate(currentTime)}</section>
		</div>
	);
};

export default DashboardClock;
