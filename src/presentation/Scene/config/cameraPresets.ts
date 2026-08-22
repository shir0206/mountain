import { DESK, COFFEE_TABLE, PERGOLA } from "./positions";
import { INITIAL_PRESET } from "../../../context/scene/types";
import type { CameraPreset, PresetKey } from "../types";

export { INITIAL_PRESET };

export const CAMERA_PRESETS: Record<PresetKey, CameraPreset> = {
  workstation: {
    position: [DESK.X + 7, DESK.Y + 2, DESK.Z + 7],
    target: [DESK.X, DESK.Y + 0.2, DESK.Z - 0.5],
  },
  meeting: {
    position: [COFFEE_TABLE.X - 6, COFFEE_TABLE.Y + 2, COFFEE_TABLE.Z + 10],
    target: [COFFEE_TABLE.X + 2, COFFEE_TABLE.Y + 1, COFFEE_TABLE.Z - 3.5],
  },
  peak: {
    position: [PERGOLA.X - 9, PERGOLA.Y + 13.95, PERGOLA.Z - 48],
    target: [PERGOLA.X - 14, PERGOLA.Y - 1.05, PERGOLA.Z + 3.5],
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
