// Canonical DEVICE / DeviceType live in `shared/device/types.ts`.
// Re-exported here so existing `context/device/types` import paths keep working
// without a context → shared → context cycle.
import {
  type DeviceType,
  type ExperienceProfile,
} from "../../shared/device/types";

export {
  DEVICE,
  EXPERIENCE_PROFILE,
  type DeviceType,
  type ExperienceProfile,
} from "../../shared/device/types";

export interface DeviceContextType {
  device: DeviceType;
  setDevice: (device: DeviceType) => void;
  profile: ExperienceProfile;
  setProfile: (profile: ExperienceProfile) => void;
}
