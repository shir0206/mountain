export type PhoneNumber = string;
export type EmailAddress = string;

export interface WhatsAppConfig {
	phoneNumber: PhoneNumber;
	text?: string;
}

export interface GoogleCalendarConfig {
	action: string;
	text: string;
	details: string;
	location: string;
	addGuests: EmailAddress[];
	conferenceDataVersion?: number;
	conferenceSolution?: string;
}

export interface EmailConfig {
	to: EmailAddress;
	subject: string;
	body: string;
}

export type ContactLinkType = "external" | "email" | "whatsapp" | "calendar";

export interface ContactLinkConfig {
	id: string;
	icon: string;
	type: ContactLinkType;
	config:
		| WhatsAppConfig
		| GoogleCalendarConfig
		| EmailConfig
		| { url: string };
}

export interface GeneratedContactLink {
	id: string;
	name: string;
	icon: string;
	url: string;
}
