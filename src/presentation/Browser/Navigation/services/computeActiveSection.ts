/**
 * Trigger-line active section detection.
 *
 * A single horizontal "trigger line" sits just below the sticky nav
 * (containerTop + offset + bias). The active section is the LAST section
 * whose top has crossed that line. This works correctly even for sections
 * taller than the viewport (e.g. the Service grid), which the previous
 * percentage-of-height approach silently skipped.
 */
export interface ComputeActiveSectionParams {
  container: HTMLElement;
  sectionIds: readonly string[];
  /** Pixel offset from container top for the sticky nav. Default 56. */
  offset?: number;
  /** Extra pixels past the nav to start counting a section as active. Default 8. */
  bias?: number;
}

const DEFAULT_OFFSET = 56;
const DEFAULT_BIAS = 8;

export const computeActiveSection = ({
  container,
  sectionIds,
  offset = DEFAULT_OFFSET,
  bias = DEFAULT_BIAS,
}: ComputeActiveSectionParams): string | null => {
  if (sectionIds.length === 0) return null;

  const containerRect = container.getBoundingClientRect();
  const triggerLine = containerRect.top + offset + bias;

  // If user has scrolled (nearly) to the bottom, force-select the last section.
  // Otherwise a short final section can never satisfy the trigger-line rule.
  const atBottom =
    container.scrollTop + container.clientHeight >=
    container.scrollHeight - 2;
  if (atBottom) return sectionIds[sectionIds.length - 1] ?? null;

  let active: string | null = null;

  for (const sectionId of sectionIds) {
    const element = document.getElementById(sectionId);
    if (!element) continue;

    const rect = element.getBoundingClientRect();
    if (rect.height <= 0) continue;

    if (rect.top <= triggerLine) {
      active = sectionId;
    } else {
      // Sections are in DOM order; first one past the line ends the walk.
      break;
    }
  }

  // Before any section crosses the line (e.g. top of page), fall back to first.
  return active ?? sectionIds[0] ?? null;
};
