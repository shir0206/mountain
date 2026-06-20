export interface OverlayCallbacks {
	showWelcome: () => void;
	showDragHint: () => void;
	hideDragHint: () => void;
	hideWelcome: () => void;
}

/**
 * Single orchestrator for the post-intro overlay sequence.
 * No context, no useEffect — just chained timeouts.
 *
 * Timeline (from call):
 *   0ms  → welcome visible
 *   3s   → drag hint + arrows visible
 *   10s  → drag hint hidden
 *   11s  → welcome hidden
 *
 * Returns a cancel function that clears all pending timers.
 */
export function runOverlaySequence(cb: OverlayCallbacks): () => void {
	cb.showWelcome();

	const t1 = window.setTimeout(cb.showDragHint, 3000);
	const t2 = window.setTimeout(cb.hideWelcome, 11000);
	const t3 = window.setTimeout(cb.hideDragHint, 10000);
	const t4 = window.setTimeout(cb.hideDragHint, 11000);

	return () => {
		clearTimeout(t1);
		clearTimeout(t2);
		clearTimeout(t3);
		clearTimeout(t4);
	};
}