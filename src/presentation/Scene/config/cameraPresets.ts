import { DESK_X, DESK_Y, DESK_Z } from "./positions";
import { INITIAL_PRESET } from "../../../context/scene/types";
import type { CameraPreset, PresetKey } from "../types";

export { INITIAL_PRESET };

export const CAMERA_PRESETS: Record<PresetKey, CameraPreset> = {
	workstation: {
		position: [DESK_X + 7, DESK_Y + 2, DESK_Z + 7],
		target: [DESK_X, DESK_Y + 0.2, DESK_Z - 0.5],
	},
	meeting: {
		position: [-3, -83, 7],
		target: [5, -87, -6.5],
	},
	peak: {
		//position: [25, -78, 40],
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
