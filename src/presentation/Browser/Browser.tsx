import { useMemo } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";

import "./Browser.css";

import { LANGUAGE } from "../../shared/i18n/language";
import { usePortfolioContext } from "../../context/portfolio/usePortfolioContext";
import { useSceneContext } from "../../context/scene/useSceneContext";
import { PortfolioContextBridge } from "../../context/portfolio/PortfolioContextBridge";
import Navigation from "./Navigation/Navigation";
import { useSectionVisibility } from "./Navigation/hooks/useScreenVisibility";
import { SECTIONS } from "./browserConfig";
import { useHtmlReady } from "./useHtmlReady";
import WebsiteSection from "./Sections/WebsiteSection/WebsiteSection";
import { BrowserHeader } from "./BrowserHeader/BrowserHeader";

interface BrowserProps {
	position: [number, number, number];
}

export default function Browser({ position }: BrowserProps) {
	const portfolio = usePortfolioContext();
	const { runIntro } = useSceneContext();
	const { browserMode, visibleSectionIds, language } = portfolio;

	const { ref: contentRef, ready } = useHtmlReady<HTMLDivElement>();
	const { setSectionRef } = useSectionVisibility(contentRef, ready);

	const vector3Position = useMemo(
		() => new THREE.Vector3(...position),
		[position]
	);

	return (
		<Html
			position={vector3Position}
			center
			wrapperClass='portfolio-wrapper'
			distanceFactor={2}
			scale={[0.005, 0.005, 0.005]}
		>
			<PortfolioContextBridge contextValue={portfolio}>
				<div
					className={`browser-container is-${browserMode}`}
					onClick={(event) => event.stopPropagation()}
				>
					<BrowserHeader />

					<div
						className={`browser-content${
							language === LANGUAGE.HE ? " rtl" : ""
						}`}
						ref={contentRef}
					>
						{!runIntro && (
							<>
								<Navigation containerRef={contentRef} />
								{SECTIONS.map(({ id, Screen }) => (
									<WebsiteSection
										key={id}
										id={id}
										isVisible={visibleSectionIds.has(id)}
										Screen={Screen}
										setRef={setSectionRef(id)}
										containerRef={contentRef}
									/>
								))}
							</>
						)}
					</div>
				</div>
			</PortfolioContextBridge>
		</Html>
	);
}
