import { createContext } from "react";

import { type DeviceContextType } from "./types";

export const DeviceContext = createContext<DeviceContextType | undefined>(
  undefined
);
