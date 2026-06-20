import type { PositionTuple } from "../types";

// Intro animation orbit control points (sweep around peak)
export const ORBIT_POINTS: PositionTuple[] = [
	[-2, -71, -55],
	[25, -78, 40],
];

export const ORBIT_TARGET: PositionTuple = [-7, -86, -3.5];

// Timing phases (seconds) — ~7.3s total
export const ORBIT_DURATION = 3.5;
export const ORBIT_TO_MEETING = 1.5;
export const MEETING_DWELL = 0.8;
export const MEETING_TO_WORKSPACE = 1.5;
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
