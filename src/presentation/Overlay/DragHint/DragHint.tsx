import { useCallback, useRef, useState } from "react";
import { Icon } from "../../../shared/components/Icon/Icon";
import { useTranslation } from "../../../context/portfolio/useTranslation";
import "./DragHint.css";

interface DragHintProps {
	onDismiss: () => void;
}

export function DragHint({ onDismiss }: DragHintProps) {
	const { t } = useTranslation();
	const [fading, setFading] = useState(false);
	const dismissedRef = useRef(false);
	const timerRef = useRef<number | null>(null);

	const triggerFadeOut = useCallback(() => {
		if (dismissedRef.current) return;
		dismissedRef.current = true;
		setFading(true);
	}, []);

	const wrapperRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (node) {
				timerRef.current = window.setTimeout(triggerFadeOut, 10000);
				window.addEventListener("pointerdown", triggerFadeOut, { once: true });
			} else {
				if (timerRef.current) clearTimeout(timerRef.current);
				window.removeEventListener("pointerdown", triggerFadeOut);
			}
		},
		[triggerFadeOut]
	);

	const handleAnimationEnd = (e: React.AnimationEvent) => {
		if (fading && e.animationName === "hintFadeOut") {
			onDismiss();
		}
	};

	return (
		<div
			ref={wrapperRef}
			className={`drag-hint-wrapper${fading ? " hidden" : ""}`}
			onAnimationEnd={handleAnimationEnd}
		>
			<div className='drag-hint-arrow drag-hint-arrow-left'>
				<Icon name='chevron' className='drag-hint-arrow-icon' size={28} />
			</div>

			<div className='drag-hint'>
				<Icon name='pointer' className='drag-hint-icon' size={36} />
				<div className='drag-hint-content'>
					<span className='drag-hint-text'>{t.overlay.dragHint.title}</span>
					<span className='drag-hint-sub'>{t.overlay.dragHint.subtitle}</span>
				</div>
			</div>

			<div className='drag-hint-arrow drag-hint-arrow-right'>
				<Icon name='chevron' className='drag-hint-arrow-icon' size={28} />
			</div>
		</div>
	);
}