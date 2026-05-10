import React, { useCallback, useMemo, useReducer } from "react";

import { SceneContext } from "./SceneContext";
import {
  INITIAL_PRESET,
  type PresetKey,
  type SceneAction,
  type SceneState,
} from "./types";

const initialState: SceneState = {
  runIntro: true,
  cameraPreset: INITIAL_PRESET,
  sceneReady: false,
};

function reducer(state: SceneState, action: SceneAction): SceneState {
  switch (action.type) {
    case "SET_RUN_INTRO":
      return { ...state, runIntro: action.runIntro };
    case "SET_CAMERA_PRESET":
      return { ...state, cameraPreset: action.preset };
    case "SET_SCENE_READY":
      return { ...state, sceneReady: action.ready };
    default:
      return state;
  }
}

export const SceneProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setRunIntro = useCallback((runIntro: boolean) => {
    dispatch({ type: "SET_RUN_INTRO", runIntro });
  }, []);

  const setCameraPreset = useCallback((preset: PresetKey) => {
    dispatch({ type: "SET_CAMERA_PRESET", preset });
  }, []);

  const setSceneReady = useCallback((ready: boolean) => {
    dispatch({ type: "SET_SCENE_READY", ready });
  }, []);

  const value = useMemo(
    () => ({ ...state, setRunIntro, setCameraPreset, setSceneReady }),
    [state, setRunIntro, setCameraPreset, setSceneReady]
  );

  return (
    <SceneContext.Provider value={value}>{children}</SceneContext.Provider>
  );
};
