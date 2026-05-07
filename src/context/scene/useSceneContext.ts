import { useContext } from "react";

import { SceneContext } from "./SceneContext";
import { type SceneContextType } from "./types";

export const useSceneContext = (): SceneContextType => {
  const context = useContext(SceneContext);
  if (!context) {
    throw new Error("useSceneContext must be used within SceneProvider");
  }
  return context;
};
