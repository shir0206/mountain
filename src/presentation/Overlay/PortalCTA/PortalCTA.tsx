import "./PortalCTA.css";
import { useTranslation } from "../../../context/portfolio/useTranslation";

interface PortalCTAProps {
	onClick: () => void;
	visible: boolean;
}

export function PortalCTA({ onClick, visible }: PortalCTAProps) {
	const { t } = useTranslation();

	if (!visible) return null;

	return (
		<button className='portal-cta' onClick={onClick} aria-label={t.overlay.portalCta.label}>
			<span className='portal-cta__ring'>
				<svg viewBox='0 0 80 80' className='portal-cta__svg'>
					<circle
						cx='40'
						cy='40'
						r='34'
						fill='none'
						stroke='url(#portalGradient)'
						strokeWidth='2.5'
					/>
					<defs>
						<linearGradient
							id='portalGradient'
							x1='0%'
							y1='0%'
							x2='100%'
							y2='100%'
						>
							<stop offset='0%' stopColor='#c9a97d' />
							<stop offset='50%' stopColor='#9a7b56' />
							<stop offset='100%' stopColor='#c9a97d' />
						</linearGradient>
					</defs>
				</svg>
			</span>
			<span className='portal-cta__label'>{t.overlay.portalCta.label}</span>
		</button>
	);
}
