import React from "react";

import "./Service.css";

import { useTranslation } from "../../../../context/portfolio/useTranslation";
import { ReactComponent as CodeIcon } from "../../../../assets/icons/process/code.svg";
import { ReactComponent as LightbulbIcon } from "../../../../assets/icons/process/lightbulb.svg";
import { ReactComponent as LoopIcon } from "../../../../assets/icons/process/loop.svg";
import { ReactComponent as SearchIcon } from "../../../../assets/icons/process/search.svg";
import { ReactComponent as SparklesIcon } from "../../../../assets/icons/process/sparkles.svg";

interface ServiceProps {
	isVisible: boolean;
	containerRef?: React.RefObject<HTMLDivElement | null>;
}

const Service: React.FC<ServiceProps> = () => {
	const { t } = useTranslation();
	const processIcons: Record<
		string,
		React.ComponentType<React.SVGProps<SVGSVGElement>>
	> = {
		search: SearchIcon,
		lightbulb: LightbulbIcon,
		code: CodeIcon,
		sparkles: SparklesIcon,
		loop: LoopIcon,
	};

	return (
		<div className="service-section">
			<div className="service-container">
				<p className="section-label reveal">{t.service.label}</p>
				<h2
					className="section-title reveal reveal-d1"
					dangerouslySetInnerHTML={{ __html: t.service.title.replace(/\n/g, "<br/>") }}
				/>

				{/* Cards Grid */}
				<p className="section-label together-cards-label reveal">
					{t.service.cardsLabel}
				</p>
				<div className="cards-grid">
					{t.service.cards.map((card, i) => (
						<div key={i} className={`service-card reveal reveal-d${Math.min(i + 1, 4)}`}>
							<div className="service-card-inner">
								<span className="service-num">{card.num}</span>
								<h3 className="service-name">{card.name}</h3>
								<p className="service-desc">{card.desc}</p>
							</div>
						</div>
					))}
				</div>

				{/* Process Timeline */}
				<p className="section-label reveal">{t.service.processLabel}</p>
				<h3
					className="process-title section-title reveal reveal-d1"
					dangerouslySetInnerHTML={{ __html: t.service.processTitle }}
				/>
				<p className="process-intro reveal reveal-d2">{t.service.processIntro}</p>
				<div className="process-list">
					{t.service.steps.map((step, i) => (
						<div key={i} className={`process-item reveal reveal-d${Math.min(i + 1, 4)}`}>
							<div className="process-dot-wrap">
								<div className="process-dot" />
							</div>
							<div className="process-content">
								<div className="process-num">
									{(() => {
										const ProcessIcon = processIcons[step.icon];
										return ProcessIcon ? (
											<ProcessIcon className="process-icon" />
										) : null;
									})()}
								</div>
								<h4 className="process-name">{step.name}</h4>
								<p className="process-desc">{step.desc}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Service;
