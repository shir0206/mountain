import React, { useMemo, useState } from "react";

import { detectDevice } from "../../shared/device/deviceDetector";
import { DeviceContext } from "./DeviceContext";
import { type DeviceType } from "./types";

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [device, setDevice] = useState<DeviceType>(
    () => detectDevice().type as DeviceType
  );

  const value = useMemo(() => ({ device, setDevice }), [device]);

  return (
    <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
  );
};
