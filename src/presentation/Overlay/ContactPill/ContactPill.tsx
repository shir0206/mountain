import "./ContactPill.css";
import { useTranslation } from "../../../context/portfolio/useTranslation";

export function ContactPill() {
  const { t } = useTranslation();
  const { ariaLabel, email } = t.overlay.contactPill;

  return (
    <a
      href={`mailto:${email}`}
      className="contact-pill"
      aria-label={ariaLabel}
    >
      <svg
        className="contact-pill-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 7l-10 6L2 7" />
      </svg>
      <span className="contact-pill-text">{email}</span>
    </a>
  );
}