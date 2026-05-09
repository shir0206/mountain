import React from "react";

export function parseEmphasis(text: string): React.ReactNode {
	const parts = text.split("**");
	if (parts.length === 1) return text;
	return parts.map((part, i) =>
		i % 2 === 1 ? (
			<strong key={i}>{part}</strong>
		) : (
			<React.Fragment key={i}>{part}</React.Fragment>
		),
	);
}