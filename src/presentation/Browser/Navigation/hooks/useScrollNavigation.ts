import { useCallback, useEffect, useRef, useState } from "react";

import { SECTION_IDS, type SectionIdType } from "../../types";
import { computeActiveSection } from "../services/computeActiveSection";
import { useNavigateToSection } from "./useNavigateToSection";

export interface UseScrollNavigationProps {
  containerRef: React.RefObject<HTMLElement | null>;
  sectionIds?: string[];
}

export interface UseScrollNavigationReturn {
  activeSection: string;
  isScrolled: boolean;
  scrollToSection: (sectionId: SectionIdType) => void;
}

const DEFAULT_SECTION_IDS: string[] = [
  SECTION_IDS.OVERVIEW,
  SECTION_IDS.ABOUT,
  SECTION_IDS.SERVICE,
  SECTION_IDS.AI,
  SECTION_IDS.CONTACT,
];

const SCROLL_THRESHOLD = 50;
const NAV_OFFSET = 56;

export const useScrollNavigation = ({
  containerRef,
  sectionIds = DEFAULT_SECTION_IDS,
}: UseScrollNavigationProps): UseScrollNavigationReturn => {
  const [activeSection, setActiveSection] = useState<string>(
    () => sectionIds[0] ?? ""
  );
  const [isScrolled, setIsScrolled] = useState(false);

  const activeSectionRef = useRef(activeSection);

  const updateActiveSection = useCallback((section: string) => {
    activeSectionRef.current = section;
    setActiveSection(section);
  }, []);

  const { scrollToSection, isScrollingRef } = useNavigateToSection({
    containerRef,
    onNavigate: updateActiveSection,
    offset: NAV_OFFSET,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number | null = null;

    const update = () => {
      rafId = null;
      setIsScrolled(container.scrollTop > SCROLL_THRESHOLD);

      if (isScrollingRef.current) return;

      const next = computeActiveSection({
        container,
        sectionIds,
        offset: NAV_OFFSET,
      });
      if (next && next !== activeSectionRef.current) {
        updateActiveSection(next);
      }
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(update);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    // Initial sync.
    update();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [containerRef, sectionIds, isScrollingRef, updateActiveSection]);

  return { activeSection, isScrolled, scrollToSection };
};
