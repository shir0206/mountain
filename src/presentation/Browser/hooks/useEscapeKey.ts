import { useEffect } from "react";

/**
 * Invoke `onEscape` when the `Escape` key is pressed while `active` is true.
 */
export function useEscapeKey(active: boolean, onEscape: () => void): void {
	useEffect(() => {
		if (!active) return;

		const handler = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.stopPropagation();
				onEscape();
			}
		};

		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [active, onEscape]);
}
