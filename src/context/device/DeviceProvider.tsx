import React, { useMemo, useState } from "react";

import { detectDevice } from "../../shared/device/deviceDetector";
import { getRenderSettings } from "../../shared/device/renderSettings";
import { DeviceContext } from "./DeviceContext";
import { type DeviceType } from "./types";

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const detection = useMemo(() => detectDevice(), []);
  const [device, setDevice] = useState<DeviceType>(
    () => detection.type as DeviceType
  );

  const value = useMemo(
    () => ({
      device,
      setDevice,
      tier: detection.tier,
      renderSettings: getRenderSettings(detection.tier, detection.nativeDpr),
    }),
    [device, detection.tier, detection.nativeDpr]
  );

  return (
    <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
  );
};