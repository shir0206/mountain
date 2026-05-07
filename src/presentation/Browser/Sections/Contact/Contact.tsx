import React, { useState } from "react";

import "./Contact.css";

import { useTranslation } from "../../../../context/portfolio/useTranslation";

interface ContactProps {
	isVisible: boolean;
	containerRef?: React.RefObject<HTMLDivElement | null>;
}

export const Contact: React.FC<ContactProps> = () => {
	const { t } = useTranslation();
	const [formStatus, setFormStatus] = useState<"idle" | "success">("idle");

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Generate mailto link as fallback
		const form = e.currentTarget;
		const name = (form.elements.namedItem("name") as HTMLInputElement)?.value;
		const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
		const message = (form.elements.namedItem("message") as HTMLTextAreaElement)?.value;

		const subject = encodeURIComponent(`New message from ${name}`);
		const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
		window.open(`mailto:${t.contact.email}?subject=${subject}&body=${body}`);
		setFormStatus("success");
	};

	return (
		<div className="contact-section">
			<div className="contact-container">
				<div className="contact-grid">
					<div className="contact-left reveal">
						<h2
							className="contact-title"
							dangerouslySetInnerHTML={{ __html: t.contact.title.replace(/\n/g, "<br/>") }}
						/>
						<p className="contact-sub">{t.contact.sub}</p>
						<a className="contact-email-link" href={`mailto:${t.contact.email}`}>
							<svg
								width="16"
								height="16"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								viewBox="0 0 24 24"
							>
								<rect x="2" y="4" width="20" height="16" rx="2" />
								<path d="m2 7 10 7 10-7" />
							</svg>
							<span>{t.contact.email}</span>
						</a>
					</div>
					<form className="contact-form reveal reveal-d2" onSubmit={handleSubmit} noValidate>
						<div className="form-row">
							<div className="form-group">
								<label>{t.contact.form.nameLabel}</label>
								<input
									type="text"
									name="name"
									placeholder={t.contact.form.namePlaceholder}
									autoComplete="name"
								/>
							</div>
							<div className="form-group">
								<label>{t.contact.form.emailLabel}</label>
								<input
									type="email"
									name="email"
									placeholder={t.contact.form.emailPlaceholder}
									autoComplete="email"
								/>
							</div>
						</div>
						<div className="form-group">
							<label>{t.contact.form.messageLabel}</label>
							<textarea
								name="message"
								placeholder={t.contact.form.messagePlaceholder}
							/>
						</div>
						<div className="form-submit">
							<button type="submit" className="btn-primary">
								{t.contact.form.submit}
							</button>
						</div>
						{formStatus === "success" && (
							<p className="form-status visible">{t.contact.form.successMsg}</p>
						)}
					</form>
				</div>
			</div>
		</div>
	);
};

export default Contact;
