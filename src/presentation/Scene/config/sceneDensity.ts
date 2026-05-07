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
