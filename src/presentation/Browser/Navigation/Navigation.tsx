import React, { useState } from "react";

import "./Navigation.css";

import { useTranslation } from "../../../context/portfolio/useTranslation";
import { usePortfolioContext } from "../../../context/portfolio/usePortfolioContext";
import { useDeviceContext } from "../../../context/device/useDeviceContext";
import { DEVICE } from "../../../context/device/types";
import { LANGUAGE } from "../../../shared/i18n/language";
import { SECTION_IDS, type SectionIdType } from "../types";
import { useScrollNavigation } from "./hooks/useScrollNavigation";

interface NavigationItem {
  id: SectionIdType;
  label: string;
  href: string;
}

interface NavigationProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const Navigation: React.FC<NavigationProps> = ({ containerRef }) => {
  const { t, language } = useTranslation();
  const { setLanguage } = usePortfolioContext();
  const { device } = useDeviceContext();
  const isMobile = device === DEVICE.MOBILE;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation items based on sections
  const navigationItems: NavigationItem[] = [
    { id: SECTION_IDS.ABOUT, label: t.navigation.about, href: "#about" },
    { id: SECTION_IDS.SERVICE, label: t.navigation.service, href: "#service" },
    { id: SECTION_IDS.AI, label: t.navigation.ai, href: "#ai" },
    { id: SECTION_IDS.CONTACT, label: t.navigation.contact, href: "#contact" },
  ];

  // Use the scroll navigation hook
  const { activeSection, isScrolled, scrollToSection } = useScrollNavigation({
    containerRef,
  });

  const handleSectionClick = (sectionId: SectionIdType) => {
    scrollToSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navigation ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="navigation-container">
        <div className="nav-logo">
          {isMobile ? (
            <>
              {t.navigation.logoShort} <em>{t.navigation.logoSeparator}</em> {t.navigation.logoShortLastName}
            </>
          ) : (
            <>
              {t.navigation.logo} <em>{t.navigation.logoSeparator}</em> {t.navigation.logoLastName}
            </>
          )}
        </div>
        <ul className="nav-links desktop-links">
          {navigationItems.map((item) => (
            <li key={`${item.label}-${item.href}`}>
              <a
                href={item.href}
                className={`nav-link ${
                  activeSection === item.id ? "active" : ""
                }`}
                onClick={(event) => {
                  event.preventDefault();
                  handleSectionClick(item.id);
                }}
                aria-label={`Navigate to ${item.label}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <div className="lang-toggle">
            <button
              className={`lang-btn ${language === LANGUAGE.EN ? "active" : ""}`}
              onClick={() => setLanguage(LANGUAGE.EN)}
              aria-label="Switch language to English"
            >
              EN
            </button>
            <button
              className={`lang-btn ${language === LANGUAGE.HE ? "active" : ""}`}
              onClick={() => setLanguage(LANGUAGE.HE)}
              aria-label="Switch language to Hebrew"
            >
              HE
            </button>
          </div>
          <button
            className="nav-cta-btn"
            onClick={() => handleSectionClick(SECTION_IDS.CONTACT)}
          >
            {t.navigation.cta}
          </button>
          <button
            className={`hamburger ${isMobileMenuOpen ? "is-open" : ""}`}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        {navigationItems.map((item) => (
          <a
            key={`${item.label}-mobile-${item.href}`}
            href={item.href}
            className={`mobile-link ${
              activeSection === item.id ? "active" : ""
            }`}
            onClick={(event) => {
              event.preventDefault();
              handleSectionClick(item.id);
            }}
            aria-label={`Navigate to ${item.label}`}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
