import "./MailtoLink.css";
import { Icon } from "../Icon/Icon";

type MailtoLinkProps = {
  email: string;
  subject?: string;
  body?: string;
  className?: string;
  iconSize?: number;
};

export function MailtoLink({
  email,
  subject,
  body,
  className = "",
  iconSize = 12,
}: MailtoLinkProps) {
  const href = buildMailtoHref(email, subject, body);

  return (
    <a
      className={`mailto-link ${className}`.trim()}
      href={href}
      aria-label={`Send email to ${email}`}
    >
      <Icon name="mail" size={iconSize} className="mailto-link-icon" />
      <span>{email}</span>
    </a>
  );
}

function buildMailtoHref(
  email: string,
  subject?: string,
  body?: string
): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString();
  return `mailto:${email}${query ? `?${query}` : ""}`;
}