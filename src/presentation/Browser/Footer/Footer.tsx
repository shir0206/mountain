import React from "react";

import "./Footer.css";

import { useTranslation } from "../../../context/portfolio/useTranslation";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear().toString();

  return (
    <footer className="footer">
      <div className="footer-name">{t.footer.name}</div>
      <p className="footer-copy">{t.footer.copy.replace("{year}", year)}</p>
    </footer>
  );
};

export default Footer;
