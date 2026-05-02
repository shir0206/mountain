import type { TextStructure } from "../../../../../shared/i18n/types";
import { CONTACT_LINKS_CONFIG } from "../contactConfig";
import type {
	ContactLinkConfig,
	EmailConfig,
	GeneratedContactLink,
	GoogleCalendarConfig,
	WhatsAppConfig,
} from "../types";
import { generateGoogleCalendarLink } from "../services/generateCalendarLink";
import { generateEmailLink } from "../services/generateEmailLink";
import { generateWhatsAppLink } from "../services/generateWhatsAppLink";

interface ContactTranslation {
	name: string;
	text?: string;
	subject?: string;
	body?: string;
	details?: string;
}

const generateExternalLink = (
	linkConfig: ContactLinkConfig,
	translation: ContactTranslation
): GeneratedContactLink => ({
	id: linkConfig.id,
	name: translation.name,
	icon: linkConfig.icon,
	url: (linkConfig.config as { url: string }).url,
});

const generateWhatsAppLinkWithTranslation = (
	linkConfig: ContactLinkConfig,
	translation: ContactTranslation
): GeneratedContactLink => ({
	id: linkConfig.id,
	name: translation.name,
	icon: linkConfig.icon,
	url: generateWhatsAppLink({
		phoneNumber: (linkConfig.config as WhatsAppConfig).phoneNumber,
		text: translation.text || "",
	}),
});

const generateEmailLinkWithTranslation = (
	linkConfig: ContactLinkConfig,
	translation: ContactTranslation
): GeneratedContactLink => ({
	id: linkConfig.id,
	name: translation.name,
	icon: linkConfig.icon,
	url: generateEmailLink({
		to: (linkConfig.config as EmailConfig).to,
		subject: translation.subject || "",
		body: translation.body || "",
	}),
});

const generateCalendarLinkWithTranslation = (
	linkConfig: ContactLinkConfig,
	translation: ContactTranslation
): GeneratedContactLink => {
	const calendarConfig = linkConfig.config as GoogleCalendarConfig;
	return {
		id: linkConfig.id,
		name: translation.name,
		icon: linkConfig.icon,
		url: generateGoogleCalendarLink({
			action: calendarConfig.action,
			text: translation.text || "",
			details: translation.details || "",
			location: calendarConfig.location,
			addGuests: calendarConfig.addGuests,
			conferenceDataVersion: calendarConfig.conferenceDataVersion,
			conferenceSolution: calendarConfig.conferenceSolution,
		}),
	};
};

const generateContactLinks = (
	translations: TextStructure["contact"]["links"]
): GeneratedContactLink[] =>
	CONTACT_LINKS_CONFIG.map((linkConfig) => {
		const translation = translations[
			linkConfig.id as keyof TextStructure["contact"]["links"]
		] as ContactTranslation;

		switch (linkConfig.type) {
			case "external":
				return generateExternalLink(linkConfig, translation);
			case "whatsapp":
				return generateWhatsAppLinkWithTranslation(linkConfig, translation);
			case "email":
				return generateEmailLinkWithTranslation(linkConfig, translation);
			case "calendar":
				return generateCalendarLinkWithTranslation(linkConfig, translation);
			default:
				throw new Error(`Unknown link type: ${linkConfig.type}`);
		}
	});

/**
 * Hook returning contact links generated from config + current translations.
 */
export const useContactLinks = (
	translations: TextStructure["contact"]["links"]
): GeneratedContactLink[] => generateContactLinks(translations);
