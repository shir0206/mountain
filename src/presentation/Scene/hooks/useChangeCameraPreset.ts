import { useCallback } from "react";

import { useSceneContext } from "../../../context/scene/useSceneContext";
import { type PresetKey } from "../types";

export const useChangeCameraPreset = (): {
  cameraPreset: PresetKey;
  changeCameraPreset: (preset: PresetKey) => void;
} => {
  const { cameraPreset, setCameraPreset } = useSceneContext();

  const changeCameraPreset = useCallback(
    (preset: PresetKey) => {
      setCameraPreset(preset);
    },
    [setCameraPreset]
  );

  return { cameraPreset, changeCameraPreset };
};
