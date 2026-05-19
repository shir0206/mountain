import React, { useCallback, useMemo, useReducer, useRef } from "react";

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
  introComplete: false,
};

function reducer(state: SceneState, action: SceneAction): SceneState {
  switch (action.type) {
    case "SET_RUN_INTRO":
      return { ...state, runIntro: action.runIntro };
    case "SET_CAMERA_PRESET":
      return { ...state, cameraPreset: action.preset };
    case "SET_SCENE_READY":
      return { ...state, sceneReady: action.ready };
    case "SET_INTRO_COMPLETE":
      return { ...state, introComplete: action.complete };
    default:
      return state;
  }
}

export const SceneProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const transitionFnRef = useRef<((preset: PresetKey) => void) | null>(null);

  const setRunIntro = useCallback((runIntro: boolean) => {
    dispatch({ type: "SET_RUN_INTRO", runIntro });
  }, []);

  const setCameraPreset = useCallback((preset: PresetKey) => {
    dispatch({ type: "SET_CAMERA_PRESET", preset });
  }, []);

  const setSceneReady = useCallback((ready: boolean) => {
    dispatch({ type: "SET_SCENE_READY", ready });
  }, []);

  const setIntroComplete = useCallback((complete: boolean) => {
    dispatch({ type: "SET_INTRO_COMPLETE", complete });
  }, []);

  const transitionToPreset = useCallback((preset: PresetKey) => {
    transitionFnRef.current?.(preset);
    dispatch({ type: "SET_CAMERA_PRESET", preset });
  }, []);

  const setTransitionFn = useCallback((fn: (preset: PresetKey) => void) => {
    transitionFnRef.current = fn;
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      setRunIntro,
      setCameraPreset,
      setSceneReady,
      setIntroComplete,
      transitionToPreset,
      setTransitionFn,
    }),
    [state, setRunIntro, setCameraPreset, setSceneReady, setIntroComplete, transitionToPreset, setTransitionFn]
  );

  return (
    <SceneContext.Provider value={value}>{children}</SceneContext.Provider>
  );
};