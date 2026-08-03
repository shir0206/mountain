import React from "react";

import "./AI.css";

import { useTranslation } from "../../../../context/portfolio/useTranslation";
import { parseEmphasis } from "../../../../shared/utils/parseEmphasis";
import { ReactComponent as LinkIcon } from "../../../../assets/icons/ai/link.svg";
import { ReactComponent as TargetIcon } from "../../../../assets/icons/ai/target.svg";
import { ReactComponent as ZapIcon } from "../../../../assets/icons/ai/zap.svg";

interface AIProps {
  isVisible: boolean;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

const AI: React.FC<AIProps> = () => {
  const { t } = useTranslation();
  const aiIcons: Record<
    string,
    React.ComponentType<React.SVGProps<SVGSVGElement>>
  > = {
    link: LinkIcon,
    zap: ZapIcon,
    target: TargetIcon,
  };

  return (
    <section className="ai-section">
      <div className="ai-container">
        <p className="section-label reveal">{t.ai.label}</p>
        <h2 className="section-title reveal reveal-d1">
          {t.ai.titleLine}
          <br />
          <strong>{t.ai.titleEmphasis}</strong>
        </h2>

        <div className="ai-intro reveal reveal-d2">
          <p className="ai-intro-text">{t.ai.introText}</p>
          <p className="ai-intro-sub">{parseEmphasis(t.ai.introSub)}</p>
        </div>

        <div className="ai-pillars">
          {t.ai.pillars.map((pillar, i) => (
            <div
              key={i}
              className={`ai-pillar reveal reveal-d${Math.min(i + 1, 4)}`}
            >
              <div className="ai-pillar-icon">
                {(() => {
                  const AiIcon = aiIcons[pillar.icon];
                  return AiIcon ? <AiIcon className="ai-icon-img" /> : null;
                })()}
              </div>
              <h3 className="ai-pillar-title">{pillar.title}</h3>
              <p className="ai-pillar-text">{pillar.text}</p>
              <div className="ai-pillar-items">
                {pillar.items.map((item, j) => (
                  <p key={j} className="ai-pillar-item">
                    {parseEmphasis(item)}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="ai-footer reveal">
          <p className="ai-footer-text">{parseEmphasis(t.ai.footerText)}</p>
        </div>
      </div>
    </section>
  );
};

export default AI;
