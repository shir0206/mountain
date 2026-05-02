import { useCallback, useRef } from "react";

import { type SectionIdType } from "../../types";

export interface UseNavigateToSectionParams {
  containerRef: React.RefObject<HTMLElement | null>;
  onNavigate?: (sectionId: SectionIdType) => void;
}

export interface UseNavigateToSectionReturn {
  scrollToSection: (sectionId: SectionIdType) => void;
  isScrollingRef: React.MutableRefObject<boolean>;
}

/**
 * Pure DOM-scroll orchestration: scrolls the container to a given section
 * and tracks an in-flight scroll flag so observers can ignore programmatic scrolls.
 */
export const useNavigateToSection = ({
  containerRef,
  onNavigate,
}: UseNavigateToSectionParams): UseNavigateToSectionReturn => {
  const isScrollingRef = useRef(false);

  const scrollToSection = useCallback(
    (sectionId: SectionIdType) => {
      const container = containerRef.current;
      const element = document.getElementById(sectionId);
      if (!container || !element) return;

      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const offsetPosition =
        elementRect.top - containerRect.top + container.scrollTop;

      isScrollingRef.current = true;
      onNavigate?.(sectionId);

      container.scrollTo({ top: offsetPosition, behavior: "smooth" });

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    },
    [containerRef, onNavigate]
  );

  return { scrollToSection, isScrollingRef };
};
