import { createContext } from "react";

import { type SceneContextType } from "./types";

export const SceneContext = createContext<SceneContextType | undefined>(
  undefined
);
