import { useEffect, useState } from "react";

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
  SECTION_IDS.CONTACT,
];

export const useScrollNavigation = ({
  containerRef,
  sectionIds = DEFAULT_SECTION_IDS,
}: UseScrollNavigationProps): UseScrollNavigationReturn => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollToSection, isScrollingRef } = useNavigateToSection({
    containerRef,
    onNavigate: (sectionId) => setActiveSection(sectionId),
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsScrolled(container.scrollTop > 50);

      if (isScrollingRef.current) return;

      const next = computeActiveSection({
        container,
        sectionIds,
      });
      if (next && next !== activeSection) {
        setActiveSection(next);
      }
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, [containerRef, sectionIds, activeSection, isScrollingRef]);

  return { activeSection, isScrolled, scrollToSection };
};
