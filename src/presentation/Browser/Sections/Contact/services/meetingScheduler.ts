/**
 * Returns the next business day if the given date falls on Friday or Saturday.
 * (Sunday-Thursday work week)
 */
export const getNextBusinessDay = (date: Date): Date => {
	const result = new Date(date);
	const day = result.getDay();

	// If Friday (5) → move to Sunday (+2)
	// If Saturday (6) → move to Sunday (+1)
	if (day === 5) result.setDate(result.getDate() + 2);
	if (day === 6) result.setDate(result.getDate() + 1);

	return result;
};

/**
 * Formats a Date into Google Calendar datetime format: YYYYMMDDTHHmmss
 */
export const formatGoogleDateTime = (date: Date, hours: number): string => {
	const d = new Date(date);
	d.setHours(hours, 0, 0, 0);

	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	const hour = String(d.getHours()).padStart(2, "0");
	const minutes = "00";
	const seconds = "00";

	return `${year}${month}${day}T${hour}${minutes}${seconds}`;
};

/**
 * Computes a proposed meeting window:
 * start = (today + 2 business days) at 11:00
 * end   = (start + 14 business days) at 15:00
 */
export const getDatesRange = (): { start: string; end: string } => {
	const today = new Date();

	// Start = today + 2 days
	let start = new Date(today);
	start.setDate(start.getDate() + 2);
	start = getNextBusinessDay(start);

	// End = start + 14 days
	let end = new Date(start);
	end.setDate(end.getDate() + 14);
	end = getNextBusinessDay(end);

	return {
		start: formatGoogleDateTime(start, 11),
		end: formatGoogleDateTime(end, 15),
	};
};
