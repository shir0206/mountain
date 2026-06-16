import "./WelcomeOverlay.css";
import { useTranslation } from "../../../context/portfolio/useTranslation";

interface WelcomeOverlayProps {
	visible: boolean;
	hiding: boolean;
	isMobile: boolean;
	onDismiss: () => void;
}

export function WelcomeOverlay({ visible, hiding, isMobile, onDismiss }: WelcomeOverlayProps) {
	const { t } = useTranslation();

	if (!visible) return null;

	function getClassName() {
		if (hiding) return "welcome-overlay welcome-overlay-out";
		if (isMobile) return "welcome-overlay welcome-overlay-instant";
		return "welcome-overlay welcome-overlay-in";
	}

	function handleAnimationEnd(e: React.AnimationEvent) {
		if (hiding && e.animationName === "welcomeFadeOut") {
			onDismiss();
		}
	}

	return (
		<div className={getClassName()} onAnimationEnd={handleAnimationEnd}>
			<h1 className='welcome-overlay-title'>{t.overlay.welcome.title}</h1>
			<p className='welcome-overlay-subtitle'>
				<em>{t.overlay.welcome.subtitle}</em>
			</p>
		</div>
	);
}