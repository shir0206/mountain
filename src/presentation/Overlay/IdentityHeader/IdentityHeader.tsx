import "./IdentityHeader.css";

import { useTranslation } from "../../../context/portfolio/useTranslation";
import { MailtoLink } from "../../../shared/components/MailtoLink/MailtoLink";
import { LanguagePill } from "../../Browser/Navigation/LanguagePill/LanguagePill";

export function IdentityHeader() {
	const { t } = useTranslation();
	const { name, email, emailSubject } = t.overlay.identity;

	return (
		<header className="identity-header">
			<div className="identity-header-left">
				<div className="identity-header-info">
					<h1 className="identity-header-name">{name}</h1>
					<MailtoLink
						email={email}
						subject={emailSubject}
						className="identity-header-email"
						iconSize={13}
					/>
				</div>
			</div>

			<div className="identity-header-right">
				<LanguagePill variant="overlay" />
			</div>
		</header>
	);
}