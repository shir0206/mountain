// Canonical DEVICE / DeviceType live in `shared/device/types.ts`.
// Re-exported here so existing `context/device/types` import paths keep working
// without a context → shared → context cycle.
import { type DeviceType, type DeviceTier } from "../../shared/device/types";
import { type RenderSettings } from "../../shared/device/renderSettings";

export {
  DEVICE,
  type DeviceType,
  DEVICE_TIER,
  type DeviceTier,
} from "../../shared/device/types";
export { type RenderSettings } from "../../shared/device/renderSettings";

export interface DeviceContextType {
  device: DeviceType;
  setDevice: (device: DeviceType) => void;
  tier: DeviceTier;
  renderSettings: RenderSettings;
}
