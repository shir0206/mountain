import type { GoogleCalendarConfig } from "../types";
import { getDatesRange } from "./meetingScheduler";

const buildConferenceParams = (
	conferenceDataVersion?: number,
	conferenceSolution?: string
): string => {
	const params: string[] = [];

	if (conferenceDataVersion !== undefined) {
		params.push(`&conferenceDataVersion=${conferenceDataVersion}`);
	}

	if (conferenceSolution) {
		params.push(`&conferenceSolution=${conferenceSolution}`);
	}

	return params.join("");
};

const buildGuestsParam = (guests: string[]): string =>
	guests.length > 0 ? guests.join(",") : "";

const buildCalendarBaseUrl = (action: string): string =>
	`https://calendar.google.com/calendar/u/0/r/eventedit?action=${action}`;

const buildCalendarQueryParams = (config: GoogleCalendarConfig): string => {
	const params = new URLSearchParams();
	const dates = getDatesRange();

	params.set("text", config.text);
	params.set("dates", `${dates.start}/${dates.end}`);
	params.set("details", config.details);
	params.set("location", config.location);

	const guests = buildGuestsParam(config.addGuests);
	if (guests) {
		params.set("add", guests);
	}

	return params.toString();
};

/**
 * Generates a Google Calendar link with the provided configuration
 */
export const generateGoogleCalendarLink = (
	config: GoogleCalendarConfig
): string => {
	const baseUrl = buildCalendarBaseUrl(config.action);
	const queryParams = buildCalendarQueryParams(config);
	const conferenceParams = buildConferenceParams(
		config.conferenceDataVersion,
		config.conferenceSolution
	);

	return `${baseUrl}&${queryParams}${conferenceParams}`;
};
