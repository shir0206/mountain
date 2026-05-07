import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import type { ExperienceProfile } from "../types";
import { getLowerProfile } from "../config/experienceProfiles";

const WINDOW_SECONDS = 2.5;
const POOR_FPS_THRESHOLD = 28;
const COOLDOWN_SECONDS = 8;

export function AdaptiveProfile({
  profile,
  introComplete,
  onProfileChange,
}: {
  profile: ExperienceProfile;
  introComplete: boolean;
  onProfileChange: (profile: ExperienceProfile) => void;
}) {
  const elapsedWindowRef = useRef(0);
  const frameCountRef = useRef(0);
  const cooldownRef = useRef(0);

  useFrame((_, delta) => {
    cooldownRef.current = Math.max(0, cooldownRef.current - delta);
    elapsedWindowRef.current += delta;
    frameCountRef.current += 1;

    if (elapsedWindowRef.current < WINDOW_SECONDS) return;

    const fps = frameCountRef.current / elapsedWindowRef.current;
    elapsedWindowRef.current = 0;
    frameCountRef.current = 0;

    if (cooldownRef.current > 0) return;
    if (!introComplete) return;
    if (fps >= POOR_FPS_THRESHOLD) return;

    const lower = getLowerProfile(profile);
    if (!lower) return;

    cooldownRef.current = COOLDOWN_SECONDS;
    onProfileChange(lower);
  });

  return null;
}
