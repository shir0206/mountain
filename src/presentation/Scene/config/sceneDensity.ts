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
// Labels of decorative objects that can be dropped on mobile to save bandwidth.
const MOBILE_CULL_LABELS = new Set([
  "Floor Lamp",
  "Desk Lamp",
  "Coaster",
  "Tablet",
  "Shelf Pot",
  "Shelf Plant",
  "Indoor Tree",
  "Tree Pot",
]);

/**
 * Returns true if this label (at this index among same-label siblings)
 * should be KEPT on mobile. Used to thin out repeated instances.
 */
export function shouldKeepOnMobile(
  label: string,
  indexAmongSameLabel: number
): boolean {
  if (!MOBILE_CULL_LABELS.has(label)) return true;
  // For culled labels, keep only the first instance (index 0)
  return indexAmongSameLabel === 0;
}
