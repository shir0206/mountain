import { useEffect } from "react";

/**
 * Lock body scroll while `active` is true. iOS-safe: freezes the page via
 * `position: fixed; top: -scrollY` and restores the exact scroll offset on
 * release. Restores original inline styles verbatim so we don't clobber
 * anything a consumer had set.
 */
export function useBodyScrollLock(active: boolean): void {
	useEffect(() => {
		if (!active) return;

		const { body } = document;
		const scrollY = window.scrollY;

		const previous = {
			overflow: body.style.overflow,
			position: body.style.position,
			top: body.style.top,
			left: body.style.left,
			right: body.style.right,
			width: body.style.width,
		};

		body.style.overflow = "hidden";
		body.style.position = "fixed";
		body.style.top = `-${scrollY}px`;
		body.style.left = "0";
		body.style.right = "0";
		body.style.width = "100%";

		return () => {
			body.style.overflow = previous.overflow;
			body.style.position = previous.position;
			body.style.top = previous.top;
			body.style.left = previous.left;
			body.style.right = previous.right;
			body.style.width = previous.width;
			window.scrollTo(0, scrollY);
		};
	}, [active]);
}
