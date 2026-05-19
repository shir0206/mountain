import { type RefObject, useEffect } from "react";

/**
 * IntersectionObserver hook that adds `.visible` class to `.reveal` elements
 * within the container. Once revealed, elements stay visible (unobserved).
 */
export function useScrollReveal(
  containerRef: RefObject<HTMLDivElement | null>,
  ready: boolean
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!ready || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, root: container }
    );

    container
      .querySelectorAll(".reveal")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [ready, containerRef]);
}
