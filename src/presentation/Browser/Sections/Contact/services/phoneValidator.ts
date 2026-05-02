import type { PhoneNumber } from "../types";

/**
 * Validates if a phone number is in the correct format for WhatsApp
 */
export const isValidWhatsAppNumber = (phoneNumber: PhoneNumber): boolean => {
	const cleanNumber = phoneNumber.replace(/\D/g, "");
	return cleanNumber.length >= 10 && cleanNumber.length <= 15;
};

/**
 * Formats a phone number for display
 */
export const formatPhoneNumber = (phoneNumber: PhoneNumber): string => {
	const cleanNumber = phoneNumber.replace(/\D/g, "");
	if (cleanNumber.length === 10) {
		return `(${cleanNumber.slice(0, 3)}) ${cleanNumber.slice(
			3,
			6
		)}-${cleanNumber.slice(6)}`;
	}
	return phoneNumber;
};
