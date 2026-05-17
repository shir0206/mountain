import { DEVICE, type DeviceType } from "../../../context/device/types";

/**
 * Device-specific scene density settings.
 * Keeps render-time decisions out of shared/ layer.
 */
export const BUTTERFLY_COUNT: Record<DeviceType, number> = {
  [DEVICE.MOBILE]: 5,
  [DEVICE.DESKTOP]: 8,
};

export function getButterflyCount(device: DeviceType): number {
  return BUTTERFLY_COUNT[device] ?? BUTTERFLY_COUNT[DEVICE.DESKTOP];
}

// ── Mobile scene culling ─────────────────────────────────────────────────────
// Labels of decorative objects that can be dropped on mobile to save ~40-60 MB.
// These are visually far from the camera or duplicate instances of repeated plants.
const MOBILE_CULL_LABELS = new Set([
  // Extra fence instances (keep 2 of 5)
  "wooden_fence a", // will keep only first 2 via index filter below — label-based cull gets 3
  // Extra plant duplicates
  "jungle BUSH",
  "jungle CROTON",
  "jungle SINENSIS",
  "jungle SNOWFLAKE",
  // Heavy decorative items far from main view
  "FLOOR_LAMP",
  "COASTER",
  "pillow",
  "rug meeting",
  "bar chair second",
]);

/**
 * Returns true if this label (at this index among same-label siblings)
 * should be KEPT on mobile. Used to thin out repeated instances.
 */
export function shouldKeepOnMobile(label: string, indexAmongSameLabel: number): boolean {
  if (!MOBILE_CULL_LABELS.has(label)) return true;
  // For culled labels, keep only the first instance (index 0)
  return indexAmongSameLabel === 0;
}
