import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import "./Browser.css";

import { BROWSER_MODE } from "../../context/portfolio/types";
import { usePortfolioContext } from "../../context/portfolio/usePortfolioContext";
import { useSectionVisibility } from "./Navigation/hooks/useScreenVisibility";
import { useHtmlReady } from "./useHtmlReady";
import { BrowserShell } from "./BrowserShell";
import { useClosePortfolio } from "./hooks/useClosePortfolio";
import { useBodyScrollLock } from "./hooks/useBodyScrollLock";
import { useTransitionState } from "./hooks/useTransitionState";
import { useEscapeKey } from "./hooks/useEscapeKey";
import { useFocusTrap } from "./hooks/useFocusTrap";


export default function Browser() {
	const { browserMode } = usePortfolioContext();
	const closePortfolio = useClosePortfolio();

	const { ref: onContentMount, nodeRef: contentRef, ready } = useHtmlReady<HTMLDivElement>();
	const { setSectionRef, visibleSections } = useSectionVisibility(
		contentRef,
		ready
	);

	const dialogRef = useRef<HTMLDivElement | null>(null);
	const previouslyFocused = useRef<HTMLElement | null>(null);

	const isOpen = browserMode !== BROWSER_MODE.CLOSED;
	const isModalMode =
		browserMode === BROWSER_MODE.OPEN ||
		browserMode === BROWSER_MODE.MAXIMIZED;

	const { state: portalState, shouldRender: portalShouldRender } =
		useTransitionState(isOpen);

	useBodyScrollLock(isModalMode);
	useEscapeKey(isModalMode, closePortfolio);
	useFocusTrap(dialogRef, isModalMode);

	// Focus management: move focus into dialog on open; restore on close.
	useEffect(() => {
		if (!isModalMode) return;

		previouslyFocused.current =
			(document.activeElement as HTMLElement | null) ?? null;

		const raf = requestAnimationFrame(() => {
			const root = dialogRef.current;
			if (!root) return;
			const firstControl = root.querySelector<HTMLElement>(
				".window-control, button, [href], [tabindex]:not([tabindex='-1'])"
			);
			firstControl?.focus();
		});

		return () => {
			cancelAnimationFrame(raf);
			const prev = previouslyFocused.current;
			if (prev && typeof prev.focus === "function") {
				prev.focus();
			}
			previouslyFocused.current = null;
		};
	}, [isModalMode]);

	if (!portalShouldRender) return null;

	const portalTarget = document.getElementById("browser-root");
	if (!portalTarget) return null;

	return createPortal(
		<>
			{isModalMode && (
				<div
					className='browser-overlay'
					data-state={portalState}
					onClick={closePortfolio}
					aria-hidden='true'
				/>
			)}
			<div
				className='browser-shell-root'
				data-state={portalState}
				role='dialog'
				aria-modal={isModalMode}
				ref={dialogRef}
			>
				<BrowserShell
					contentRef={contentRef}
					onContentMount={onContentMount}
					setSectionRef={setSectionRef}
					visibleSectionIds={visibleSections}
				/>
			</div>
		</>,
		portalTarget
	);
}
