// PresetKey is scene state owned by context/scene. presentation/Scene/types.ts
// re-exports it to preserve existing import paths without crossing the
// context → presentation dependency rule.
export type PresetKey = "workstation" | "meeting" | "balcony" | "garden";

export const INITIAL_PRESET: PresetKey = "workstation";

export interface SceneState {
  runIntro: boolean;
  cameraPreset: PresetKey;
}

export type SceneAction =
  | { type: "SET_RUN_INTRO"; runIntro: boolean }
  | { type: "SET_CAMERA_PRESET"; preset: PresetKey };

export interface SceneContextType extends SceneState {
  setRunIntro: (runIntro: boolean) => void;
  setCameraPreset: (preset: PresetKey) => void;
}
