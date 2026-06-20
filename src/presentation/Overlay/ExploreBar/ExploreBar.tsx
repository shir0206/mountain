import "./ExploreBar.css";
import type { PresetKey } from "../../Scene/types";
import { useTranslation } from "../../../context/portfolio/useTranslation";
import { Icon } from "../../../shared/components/Icon/Icon";

interface ExploreBarProps {
  activePreset: PresetKey;
  onNavigate: (preset: PresetKey) => void;
}

const AREA_KEYS: PresetKey[] = ["workstation", "meeting", "peak"];

export function ExploreBar({ activePreset, onNavigate }: ExploreBarProps) {
  const { t } = useTranslation();
  const { ariaLabel, areas } = t.overlay.exploreBar;

  return (
    <nav className="explore-bar" aria-label={ariaLabel}>
      {AREA_KEYS.map((key, i) => {
        const isActive = activePreset === key;
        const area = areas[i];
        return (
          <button
            key={key}
            className={`explore-btn${isActive ? " active" : ""}`}
            onClick={() => onNavigate(key)}
            aria-current={isActive ? "location" : undefined}
            aria-label={`Go to ${area.label}`}
          >
            <span className="explore-icon">
              <Icon name={key} className="explore-icon-svg" />
            </span>
            <span className="explore-label">{area.label}</span>
            <span className="explore-sub">{area.subtitle}</span>
          </button>
        );
      })}
    </nav>
  );
}