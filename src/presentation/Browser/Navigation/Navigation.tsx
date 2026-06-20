import React, { useState } from "react";

import "./Navigation.css";

import { useTranslation } from "../../../context/portfolio/useTranslation";
import { useDeviceContext } from "../../../context/device/useDeviceContext";
import { DEVICE } from "../../../context/device/types";
import { SECTION_IDS, type SectionIdType } from "../types";
import { useScrollNavigation } from "./hooks/useScrollNavigation";
import { LanguagePill } from "./LanguagePill/LanguagePill";

interface NavigationItem {
  id: SectionIdType;
  label: string;
  href: string;
}

interface NavigationProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const Navigation: React.FC<NavigationProps> = ({ containerRef }) => {
  const { t } = useTranslation();
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
    <nav className={`navigation ${isScrolled ? "navigation-scrolled" : ""}`}>
      <div className="navigation-container">
        <div className="navigation-logo">
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
        <ul className="navigation-links">
          {navigationItems.map((item) => (
            <li key={`${item.label}-${item.href}`}>
              <a
                href={item.href}
                className={`navigation-link ${
                  activeSection === item.id ? "navigation-link-active" : ""
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
        <div className="navigation-right">
          <LanguagePill />
          <button
            className="navigation-cta-btn"
            onClick={() => handleSectionClick(SECTION_IDS.CONTACT)}
          >
            {t.navigation.cta}
          </button>
          <button
            className={`navigation-hamburger ${isMobileMenuOpen ? "navigation-hamburger-open" : ""}`}
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
      <div className={`navigation-mobile-menu ${isMobileMenuOpen ? "navigation-mobile-menu-open" : ""}`}>
        {navigationItems.map((item) => (
          <a
            key={`${item.label}-mobile-${item.href}`}
            href={item.href}
            className={`navigation-mobile-link ${
              activeSection === item.id ? "navigation-mobile-link-active" : ""
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