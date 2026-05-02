import React from "react";

import "./Contact.css";

import { useTranslation } from "../../../../context/portfolio/useTranslation";
import { Icon } from "../../../../shared/components/Icon/Icon";
import { useContactLinks } from "./hooks/useContactLinks";

// Types
type IconName = "linkedin" | "mail" | "calendar" | "whatsapp";

interface ContactLinkProps {
	name: string;
	icon: IconName;
	url: string;
}

// Contact Link Component
const ContactLink: React.FC<ContactLinkProps> = ({ name, icon, url }) => {
	return (
		<a
			href={url}
			className='contact-link'
			target='_blank'
			rel='noopener noreferrer'
			aria-label={name}
		>
			<Icon name={icon} />
		</a>
	);
};

// Main Contact Component
interface ContactProps {
	isVisible: boolean;
	containerRef?: React.RefObject<HTMLDivElement | null>;
}

export const Contact: React.FC<ContactProps> = () => {
	const { t } = useTranslation();

	const contactLinks = useContactLinks(t.contact.links);

	return (
		<div className='contact-container'>
			<div className='contact-content'>
				<h3 className='contact-title'>{t.contact.title}</h3>
				<div className='contact-subtitle-container'>
					<p className='contact-subtitle'>{t.contact.subtitlePrimary}</p>
					<p className='contact-subtitle'>{t.contact.subtitleSecondary}</p>
				</div>
				<div className='contact-list'>
					{contactLinks.map(({ name, icon, url }) => (
						<ContactLink
							key={name}
							name={name}
							icon={icon as IconName}
							url={url}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default Contact;
