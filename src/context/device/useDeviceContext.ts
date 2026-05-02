import { useContext } from "react";

import { DeviceContext } from "./DeviceContext";
import { type DeviceContextType } from "./types";

export const useDeviceContext = (): DeviceContextType => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error("useDeviceContext must be used within DeviceProvider");
  }
  return context;
};
