import { useDeviceContext } from "../../../context/device/useDeviceContext";
import { getButterflyCount } from "../config/sceneDensity";

/**
 * Scene-only hook: returns butterfly count for the current device.
 */
export function useButterflyCount(): number {
  const { device } = useDeviceContext();
  return getButterflyCount(device);
}
