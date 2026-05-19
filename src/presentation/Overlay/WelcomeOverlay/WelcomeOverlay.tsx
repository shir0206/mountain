import "./WelcomeOverlay.css";
import { useTranslation } from "../../../context/portfolio/useTranslation";

interface WelcomeOverlayProps {
	visible: boolean;
	hiding: boolean;
	onDismiss: () => void;
}

export function WelcomeOverlay({ visible, hiding, onDismiss }: WelcomeOverlayProps) {
	const { t } = useTranslation();

	if (!visible) return null;

	const className = `welcome-overlay ${hiding ? "welcome-overlay-out" : "welcome-overlay-in"}`;

	return (
		<div className={className} onTransitionEnd={() => hiding && onDismiss()}>
			<h1 className='welcome-overlay-title'>{t.overlay.welcome.title}</h1>
			<p className='welcome-overlay-subtitle'>
				<em>{t.overlay.welcome.subtitle}</em>
			</p>
		</div>
	);
}
