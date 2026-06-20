import React from "react";

import "./Footer.css";

import { useTranslation } from "../../../context/portfolio/useTranslation";
import { parseEmphasis } from "../../../shared/utils/parseEmphasis";

const Footer: React.FC = () => {
	const { t } = useTranslation();
	const year = new Date().getFullYear().toString();

	return (
		<footer className="footer">
			<div className="footer-name">
				{parseEmphasis(t.footer.name)}
			</div>
			<p className="footer-copy">{t.footer.copy.replace("{year}", year)}</p>
		</footer>
	);
};

export default Footer;