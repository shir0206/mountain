import type { ContactLinkConfig } from "./types";

/**
 * Contact links configuration - Single source of truth for link structure
 */
export const CONTACT_LINKS_CONFIG: ContactLinkConfig[] = [
	{
		id: "linkedin",
		icon: "linkedin",
		type: "external",
		config: {
			url: "https://www.linkedin.com/in/shir-zabolotny-a83b18109/",
		},
	},
	{
		id: "whatsapp",
		icon: "whatsapp",
		type: "whatsapp",
		config: {
			phoneNumber: "+972542098332",
			text: "",
		},
	},
	{
		id: "email",
		icon: "mail",
		type: "email",
		config: {
			to: "shirzabolotny@gmail.com",
			subject: "",
			body: "",
		},
	},
	{
		id: "scheduleMeeting",
		icon: "calendar",
		type: "calendar",
		config: {
			action: "EVENTEDIT",
			text: "",
			details: "",
			location: "Google Meet",
			addGuests: ["shirzabolotny@gmail.com"],
			conferenceDataVersion: 1,
			conferenceSolution: "hangoutsMeet",
		},
	},
];
