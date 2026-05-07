import { useEffect, type RefObject } from "react";

const FOCUSABLE_SELECTOR = [
	"a[href]",
	"area[href]",
	"button:not([disabled])",
	"input:not([disabled]):not([type='hidden'])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"iframe",
	"object",
	"embed",
	"[contenteditable='true']",
	"[tabindex]:not([tabindex='-1'])",
].join(",");

function getFocusable(root: HTMLElement): HTMLElement[] {
	return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
		(el) => !el.hasAttribute("disabled") && el.tabIndex !== -1
	);
}

/**
 * Trap Tab/Shift+Tab focus inside `containerRef` while `active` is true.
 */
export function useFocusTrap(
	containerRef: RefObject<HTMLElement | null>,
	active: boolean
): void {
	useEffect(() => {
		if (!active) return;
		const root = containerRef.current;
		if (!root) return;

		const handler = (event: KeyboardEvent) => {
			if (event.key !== "Tab") return;
			const focusables = getFocusable(root);
			if (focusables.length === 0) {
				event.preventDefault();
				root.focus();
				return;
			}
			const first = focusables[0];
			const last = focusables[focusables.length - 1];
			const active = document.activeElement as HTMLElement | null;

			if (event.shiftKey) {
				if (active === first || !root.contains(active)) {
					event.preventDefault();
					last.focus();
				}
			} else {
				if (active === last) {
					event.preventDefault();
					first.focus();
				}
			}
		};

		root.addEventListener("keydown", handler);
		return () => root.removeEventListener("keydown", handler);
	}, [active, containerRef]);
}
