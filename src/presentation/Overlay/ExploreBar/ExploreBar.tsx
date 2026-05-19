import "./ExploreBar.css";
import type { PresetKey } from "../../Scene/types";
import { useTranslation } from "../../../context/portfolio/useTranslation";

interface ExploreBarProps {
  activePreset: PresetKey;
  onNavigate: (preset: PresetKey) => void;
}

const AREA_KEYS: PresetKey[] = ["workstation", "meeting", "balcony", "garden"];

function AreaIcon({ areaKey }: { areaKey: PresetKey }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "explore-icon-svg",
  };

  switch (areaKey) {
    case "workstation":
      return (
        <svg {...props}>
          {/* Monitor/desk */}
          <rect x="4" y="4" width="16" height="12" rx="1.5" />
          <path d="M8 20h8" />
          <path d="M12 16v4" />
        </svg>
      );
    case "meeting":
      return (
        <svg {...props}>
          {/* People group */}
          <circle cx="9" cy="7" r="2.5" />
          <circle cx="15" cy="7" r="2.5" />
          <path d="M4 19c0-3 2.5-5 5-5s5 2 5 5" />
          <path d="M14 14c2.5 0 5 2 5 5" />
        </svg>
      );
    case "balcony":
      return (
        <svg {...props}>
          {/* Railing / terrace */}
          <path d="M3 12h18" />
          <path d="M5 12v8" />
          <path d="M9 12v8" />
          <path d="M13 12v8" />
          <path d="M17 12v8" />
          <path d="M19 12v8" />
          <path d="M3 20h18" />
          <path d="M7 4l5-2 5 2v8" />
        </svg>
      );
    case "garden":
      return (
        <svg {...props}>
          {/* Mountain peak */}
          <path d="M4 20L10 8l3 5 3-3 4 10H4z" />
          <path d="M14 10l2-3 4 7" />
        </svg>
      );
  }
}

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
              <AreaIcon areaKey={key} />
            </span>
            <span className="explore-label">{area.label}</span>
            <span className="explore-sub">{area.subtitle}</span>
          </button>
        );
      })}
    </nav>
  );
}