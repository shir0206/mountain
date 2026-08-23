import { DESK, TABLE, PERGOLA } from "./positions";
import { INITIAL_PRESET } from "../../../context/scene/types";
import type { CameraPreset, PresetKey } from "../types";

export { INITIAL_PRESET };

export const CAMERA_PRESETS: Record<PresetKey, CameraPreset> = {
  workstation: {
    position: [DESK.X + 4, DESK.Y + 2, DESK.Z + 9],
    target: [DESK.X, DESK.Y + 0.2, DESK.Z - 0.5],
  },
  meeting: {
    position: [TABLE.X - 4, TABLE.Y + 2.7, TABLE.Z + 4],
    target: [TABLE.X + 2, TABLE.Y - 0.3, TABLE.Z - 2],
  },
  peak: {
    position: [PERGOLA.X - 9, PERGOLA.Y + 13.95, PERGOLA.Z - 48],
    target: [PERGOLA.X - 14, PERGOLA.Y - 0.5, PERGOLA.Z + 3.5],
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
