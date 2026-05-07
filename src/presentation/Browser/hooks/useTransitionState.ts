import { useEffect, useRef, useState } from "react";

export type TransitionState = "entering" | "entered" | "exiting" | "exited";

const ENTER_DURATION_MS = 260;
const EXIT_DURATION_MS = 200;

/**
 * Drives CSS `data-state` attributes for mount/unmount choreography
 * without pulling in AnimatePresence.
 *
 * Lifecycle:
 *   active=false   → "exited"
 *   active=true    → "entering" → (rAF) → "entered"
 *   active=false   → "exiting"  → (timeout) → "exited"
 *
 * Returns `{ state, shouldRender }`. Consumer keeps the node mounted
 * while `shouldRender === true`, and reflects `state` via `data-state`.
 */
export function useTransitionState(active: boolean): {
	state: TransitionState;
	shouldRender: boolean;
} {
	const [state, setState] = useState<TransitionState>(
		active ? "entered" : "exited"
	);
	const exitTimer = useRef<number | null>(null);
	const enterRaf = useRef<number | null>(null);

	useEffect(() => {
		if (active) {
			if (exitTimer.current !== null) {
				window.clearTimeout(exitTimer.current);
				exitTimer.current = null;
			}
			setState("entering");
			enterRaf.current = window.requestAnimationFrame(() => {
				enterRaf.current = window.requestAnimationFrame(() => {
					setState("entered");
				});
			});
		} else {
			if (enterRaf.current !== null) {
				window.cancelAnimationFrame(enterRaf.current);
				enterRaf.current = null;
			}
			setState((prev) => (prev === "exited" ? "exited" : "exiting"));
			exitTimer.current = window.setTimeout(() => {
				setState("exited");
				exitTimer.current = null;
			}, EXIT_DURATION_MS);
		}

		return () => {
			if (enterRaf.current !== null) {
				window.cancelAnimationFrame(enterRaf.current);
				enterRaf.current = null;
			}
			if (exitTimer.current !== null) {
				window.clearTimeout(exitTimer.current);
				exitTimer.current = null;
			}
		};
	}, [active]);

	const shouldRender = active || state !== "exited";

	return { state, shouldRender };
}

export const TRANSITION_DURATIONS = {
	enter: ENTER_DURATION_MS,
	exit: EXIT_DURATION_MS,
};
