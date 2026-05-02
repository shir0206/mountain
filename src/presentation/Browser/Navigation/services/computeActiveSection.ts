/**
 * Pure scoring: given a scroll container and candidate section ids,
 * return the section with the greatest visible portion (≥50%).
 * Returns null when no section meets the threshold.
 */
export interface ComputeActiveSectionParams {
  container: HTMLElement;
  sectionIds: readonly string[];
  threshold?: number;
}

export const computeActiveSection = ({
  container,
  sectionIds,
  threshold = 50,
}: ComputeActiveSectionParams): string | null => {
  const containerRect = container.getBoundingClientRect();
  const containerTop = containerRect.top;
  const containerBottom = containerRect.bottom;

  let maxVisibleSection: string | null = null;
  let maxVisiblePercentage = 0;

  for (const sectionId of sectionIds) {
    const element = document.getElementById(sectionId);
    if (!element) continue;

    const elementRect = element.getBoundingClientRect();
    const elementHeight = elementRect.height;
    if (elementHeight <= 0) continue;

    const visibleTop = Math.max(elementRect.top, containerTop);
    const visibleBottom = Math.min(elementRect.bottom, containerBottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const visiblePercentage = (visibleHeight / elementHeight) * 100;

    if (
      visiblePercentage >= threshold &&
      visiblePercentage > maxVisiblePercentage
    ) {
      maxVisibleSection = sectionId;
      maxVisiblePercentage = visiblePercentage;
    }
  }

  return maxVisibleSection;
};
