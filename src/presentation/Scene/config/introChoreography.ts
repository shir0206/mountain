import type { Position3D } from "../types";

// Intro animation orbit control points
export const ORBIT_POINTS: Position3D[] = [
	[-21, -10, -2],
	[-21, -15, 0],
	[-25, -20, 14],
	[-14, -21.5, 24],
	[4, -20, 30],
	[16.37, -19.86, 28.95],
];

export const ORBIT_TARGET: Position3D = [4, -33.98, -5.7];

// Timing phases (seconds)
export const ORBIT_DURATION = 6;
export const ORBIT_TO_MEETING = 2;
export const MEETING_DWELL = 1.5;
export const MEETING_TO_WORKSPACE = 2.5;
export const INTRO_DURATION =
	ORBIT_DURATION + ORBIT_TO_MEETING + MEETING_DWELL + MEETING_TO_WORKSPACE;

export type IntroPhaseName =
	| "orbit"
	| "orbitToMeeting"
	| "meetingDwell"
	| "meetingToWorkspace";

/** Returns the current intro phase and local segment progress [0..1]. */
export function phaseAt(elapsed: number): {
	phase: IntroPhaseName;
	local: number;
} {
	if (elapsed <= ORBIT_DURATION) {
		return { phase: "orbit", local: elapsed / ORBIT_DURATION };
	}
	if (elapsed <= ORBIT_DURATION + ORBIT_TO_MEETING) {
		return {
			phase: "orbitToMeeting",
			local: (elapsed - ORBIT_DURATION) / ORBIT_TO_MEETING,
		};
	}
	if (elapsed <= ORBIT_DURATION + ORBIT_TO_MEETING + MEETING_DWELL) {
		return { phase: "meetingDwell", local: 0 };
	}
	const segment = elapsed - ORBIT_DURATION - ORBIT_TO_MEETING - MEETING_DWELL;
	return { phase: "meetingToWorkspace", local: segment / MEETING_TO_WORKSPACE };
}
