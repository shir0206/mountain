import "./IdentityHeader.css";

import { useTranslation } from "../../../context/portfolio/useTranslation";
import { MailtoLink } from "../../../shared/components/MailtoLink/MailtoLink";
import LanguageSwitcher from "../../Browser/Navigation/LanguageSwitcher/LanguageSwitcher";

export function IdentityHeader() {
  const { t } = useTranslation();
  const { name, email, emailSubject } = t.overlay.identity;

  return (
    <header className="identity-header">
      <div className="identity-header__left">
        <span className="identity-header__name">{name}</span>
        <MailtoLink
          email={email}
          subject={emailSubject}
          className="identity-header__email"
          iconSize={11}
        />
      </div>
      <div className="identity-header__right">
        <LanguageSwitcher />
      </div>
    </header>
  );
}