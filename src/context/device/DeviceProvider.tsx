import React, { useEffect, useMemo, useState } from "react";

import { detectDevice } from "../../shared/device/deviceDetector";
import { DeviceContext } from "./DeviceContext";
import {
  EXPERIENCE_PROFILE,
  type DeviceType,
  type ExperienceProfile,
} from "./types";

const PROFILE_STORAGE_KEY = "mountain.experienceProfile";

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const detection = useMemo(() => detectDevice(), []);
  const [device, setDevice] = useState<DeviceType>(() => detection.type);
  const [profile, setProfile] = useState<ExperienceProfile>(() => {
    const stored = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (
      stored === EXPERIENCE_PROFILE.CINEMATIC ||
      stored === EXPERIENCE_PROFILE.HYBRID ||
      stored === EXPERIENCE_PROFILE.FULL
    ) {
      return stored;
    }
    return detection.defaultProfile;
  });

  useEffect(() => {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, profile);
  }, [profile]);

  const value = useMemo(
    () => ({ device, setDevice, profile, setProfile }),
    [device, profile]
  );

  return (
    <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
  );
};
