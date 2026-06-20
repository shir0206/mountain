import "./LanguagePill.css";

import { useTranslation } from "../../../../context/portfolio/useTranslation";
import { usePortfolioContext } from "../../../../context/portfolio/usePortfolioContext";
import { LANGUAGE } from "../../../../shared/i18n/language";

interface LanguagePillProps {
  variant?: "default" | "overlay";
}

export function LanguagePill({ variant = "default" }: LanguagePillProps) {
  const { language } = useTranslation();
  const { setLanguage } = usePortfolioContext();

  const toggleClass =
    variant === "overlay"
      ? "language-pill-toggle-overlay"
      : "language-pill-toggle";

  return (
    <div className={toggleClass}>
      <button
        className={`language-pill-btn ${language === LANGUAGE.EN ? "language-pill-btn-active" : ""}`}
        onClick={() => setLanguage(LANGUAGE.EN)}
        aria-label="Switch language to English"
      >
        EN
      </button>
      <button
        className={`language-pill-btn ${language === LANGUAGE.HE ? "language-pill-btn-active" : ""}`}
        onClick={() => setLanguage(LANGUAGE.HE)}
        aria-label="Switch language to Hebrew"
      >
        HE
      </button>
    </div>
  );
}