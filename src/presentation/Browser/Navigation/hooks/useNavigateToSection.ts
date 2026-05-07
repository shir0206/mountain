import { useCallback, useEffect, useRef } from "react";

import { type SectionIdType } from "../../types";

export interface UseNavigateToSectionParams {
  containerRef: React.RefObject<HTMLElement | null>;
  onNavigate?: (sectionId: SectionIdType) => void;
  /** Pixel offset for sticky nav. Default 56. */
  offset?: number;
}

export interface UseNavigateToSectionReturn {
  scrollToSection: (sectionId: SectionIdType) => void;
  isScrollingRef: React.MutableRefObject<boolean>;
}

const DEFAULT_OFFSET = 56;
const SCROLL_SETTLE_TIMEOUT = 800;
const SCROLL_SETTLE_POLL_MS = 80;

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Pure DOM-scroll orchestration: scrolls the container to a given section
 * with easing + sticky-nav offset, tracks an in-flight scroll flag so
 * observers can ignore programmatic scrolls, and guards fast repeated clicks
 * targeting the same section.
 */
export const useNavigateToSection = ({
  containerRef,
  onNavigate,
  offset = DEFAULT_OFFSET,
}: UseNavigateToSectionParams): UseNavigateToSectionReturn => {
  const isScrollingRef = useRef(false);
  const pendingTargetRef = useRef<SectionIdType | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  const pollTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
    if (pollTimerRef.current !== null) {
      window.clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const scrollToSection = useCallback(
    (sectionId: SectionIdType) => {
      const container = containerRef.current;
      const element = document.getElementById(sectionId);
      if (!container || !element) return;

      // Ignore spam clicks on the same target while scrolling is in flight.
      if (isScrollingRef.current && pendingTargetRef.current === sectionId) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const rawTop = elementRect.top - containerRect.top + container.scrollTop;
      const maxScroll = container.scrollHeight - container.clientHeight;
      const targetTop = Math.max(0, Math.min(rawTop - offset, maxScroll));

      isScrollingRef.current = true;
      pendingTargetRef.current = sectionId;
      onNavigate?.(sectionId);

      clearTimers();

      container.scrollTo({
        top: targetTop,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });

      // Settle detection: poll until scrollTop stabilizes, then clear flag.
      let lastTop = container.scrollTop;
      let stableFrames = 0;

      const poll = () => {
        const current = container.scrollTop;
        if (Math.abs(current - lastTop) < 1) {
          stableFrames += 1;
        } else {
          stableFrames = 0;
          lastTop = current;
        }
        if (stableFrames >= 2) {
          isScrollingRef.current = false;
          pendingTargetRef.current = null;
          pollTimerRef.current = null;
          return;
        }
        pollTimerRef.current = window.setTimeout(poll, SCROLL_SETTLE_POLL_MS);
      };
      pollTimerRef.current = window.setTimeout(poll, SCROLL_SETTLE_POLL_MS);

      // Hard ceiling so flag never stays stuck.
      settleTimerRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
        pendingTargetRef.current = null;
        if (pollTimerRef.current !== null) {
          window.clearTimeout(pollTimerRef.current);
          pollTimerRef.current = null;
        }
      }, SCROLL_SETTLE_TIMEOUT);
    },
    [containerRef, onNavigate, offset, clearTimers]
  );

  return { scrollToSection, isScrollingRef };
};
