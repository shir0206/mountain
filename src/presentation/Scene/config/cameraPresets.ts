import { DESK } from "./positions";
import { INITIAL_PRESET } from "../../../context/scene/types";
import type { CameraPreset, PresetKey } from "../types";

export { INITIAL_PRESET };

export const CAMERA_PRESETS: Record<PresetKey, CameraPreset> = {
  workstation: {
    position: [DESK.X + 7, DESK.Y + 2, DESK.Z + 7],
    target: [DESK.X, DESK.Y + 0.2, DESK.Z - 0.5],
  },
  meeting: {
    position: [-3, -84, 7],
    target: [5, -87, -6.5],
  },
  peak: {
    position: [-2, -71, -55],
    target: [-7, -86, -3.5],
  },
};

export interface PresetButton {
  key: PresetKey;
  label: string;
}

export const PRESET_BUTTONS: PresetButton[] = [
  { key: "workstation", label: "Workstation" },
  { key: "meeting", label: "Meeting" },
  { key: "peak", label: "Peak" },
];
