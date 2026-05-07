import React from "react";

import "./About.css";

import imagePath from "../../../../assets/images/shirzabolotny.png?url";
import { useTranslation } from "../../../../context/portfolio/useTranslation";

interface AboutProps {
	isVisible: boolean;
	containerRef?: React.RefObject<HTMLDivElement | null>;
}

const About: React.FC<AboutProps> = () => {
	const { t } = useTranslation();

	return (
		<div className="about-section">
			<div className="about-grid">
				<div className="about-photo-wrap reveal">
					<div className="about-photo">
						<img src={imagePath} alt="Shir Zabolotny" />
					</div>
				</div>
				<div className="about-body">
					<p className="section-label reveal">{t.about.label}</p>
					<h2
						className="section-title reveal reveal-d1"
						dangerouslySetInnerHTML={{ __html: t.about.title.replace(/\n/g, "<br/>") }}
					/>
					{t.about.paragraphs.map((p, i) => (
						<p
							key={i}
							className={`about-paragraph reveal reveal-d${Math.min(i + 2, 4)}`}
							dangerouslySetInnerHTML={{ __html: p }}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default About;
