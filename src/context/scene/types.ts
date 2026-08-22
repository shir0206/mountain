// PresetKey is scene state owned by context/scene. presentation/Scene/types.ts
// re-exports it to preserve existing import paths without crossing the
// context → presentation dependency rule.
export type PresetKey = "workstation" | "meeting" | "peak";

export const INITIAL_PRESET: PresetKey = "workstation";

export interface SceneState {
  runIntro: boolean;
  cameraPreset: PresetKey;
  sceneReady: boolean;
  introComplete: boolean;
}

export type SceneAction =
  | { type: "SET_RUN_INTRO"; runIntro: boolean }
  | { type: "SET_CAMERA_PRESET"; preset: PresetKey }
  | { type: "SET_SCENE_READY"; ready: boolean }
  | { type: "SET_INTRO_COMPLETE"; complete: boolean };

export interface SceneContextType extends SceneState {
  setRunIntro: (runIntro: boolean) => void;
  setCameraPreset: (preset: PresetKey) => void;
  setSceneReady: (ready: boolean) => void;
  setIntroComplete: (complete: boolean) => void;
  transitionToPreset: (preset: PresetKey) => void;
  setTransitionFn: (fn: (preset: PresetKey) => void) => void;
}
