import React from "react";

import "./Overview.css";

import { SECTION_IDS } from "../../types";
import { useTranslation } from "../../../../context/portfolio/useTranslation";
import { useScrollNavigation } from "../../Navigation/hooks/useScrollNavigation";

interface OverviewProps {
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

const Overview: React.FC<OverviewProps> = ({ containerRef }) => {
  const { t } = useTranslation();

  const { scrollToSection } = useScrollNavigation({
    containerRef: containerRef || { current: null },
  });

  const handleActionClick = (href: string) => {
    const id = Object.values(SECTION_IDS).find(
      (v) => v === href.replace("#", "")
    );
    if (id) {
      scrollToSection(id);
    }
  };

  return (
    <section className="hero">
      <div className="hero-inner">
        <h1 className="hero-title">
          {t.hero.titleLine}
          <br />
          <em>{t.hero.titleEmphasis}</em>
        </h1>
        <p className="hero-sub">{t.hero.sub}</p>
        <div className="hero-actions">
          {t.hero.actions.map((action, i) => (
            <button
              key={i}
              className={
                action.style === "primary" ? "btn-primary" : "btn-ghost"
              }
              onClick={() => handleActionClick(action.href)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Overview;
