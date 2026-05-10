import {
  DESK_X,
  DESK_Y,
  DESK_Z,
  COFFEE_TABLE_X,
  COFFEE_TABLE_Y,
  COFFEE_TABLE_Z,
  MUD_X,
  MUD_Y,
  MUD_Z,
} from "./positions";
import { INITIAL_PRESET } from "../../../context/scene/types";
import type { CameraPreset, PresetKey } from "../types";

export { INITIAL_PRESET };

export const CAMERA_PRESETS: Record<PresetKey, CameraPreset> = {
  workstation: {
    position: [DESK_X + 7, DESK_Y + 4.5, DESK_Z + 7],
    target: [DESK_X - 2, DESK_Y + 0.2, DESK_Z - 2],
  },
  meeting: {
    position: [COFFEE_TABLE_X + 3, COFFEE_TABLE_Y + 1.8, COFFEE_TABLE_Z + 3.2],
    target: [COFFEE_TABLE_X - 1.2, COFFEE_TABLE_Y + 0.8, COFFEE_TABLE_Z],
  },
  balcony: {
    position: [-3.1, -33.43, -10.73],
    target: [0, -33.8, -15.6],
  },
  garden: {
    position: [-21, -10, -10],
    target: [4, -33.98, -5.7],
  },
};

export interface PresetButton {
  key: PresetKey;
  label: string;
  color: string;
}

export const PRESET_BUTTONS: PresetButton[] = [
  { key: "workstation", label: "Workstation", color: "#e88a3a" },
  { key: "meeting", label: "Meeting", color: "#6aa5d8" },
  { key: "balcony", label: "Balcony", color: "#7fc27f" },
  { key: "garden", label: "Garden", color: "#8dbf6a" },
];
