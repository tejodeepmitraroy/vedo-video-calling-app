const convertISOTo12HourFormat = (isoString: Date) => {
	const dateObj = new Date(isoString);

	// Extract date parts
	const day = dateObj.getDate();
	const month = dateObj.getMonth() + 1; // Months are zero-based
	const year = dateObj.getFullYear();

	// Extract time parts
	let hours = dateObj.getHours();
	const minutes = dateObj.getMinutes();
	// const seconds = dateObj.getSeconds();

	// Determine AM/PM suffix
	const ampm = hours >= 12 ? 'PM' : 'AM';

	// Convert hours from 24-hour to 12-hour format
	hours = hours % 12;
	hours = hours ? hours : 12; // The hour '0' should be '12'

	// Pad minutes and seconds with leading zeros if necessary
	const minutesStr = minutes < 10 ? '0' + minutes : minutes;
	// const secondsStr = seconds < 10 ? '0' + seconds : seconds;

	// const time12Hour = `${hours}:${minutesStr}:${secondsStr} ${ampm}`;
	const time12Hour = `${hours}:${minutesStr} ${ampm}`;
	const date = `${month}/${day}/${year}`;

	return {
		date: date,
		time: time12Hour,
		timeDate: `${time12Hour} ${time12Hour}`,
	};
};

export default convertISOTo12HourFormat;
