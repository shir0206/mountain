import { type RefObject } from "react";

import { LANGUAGE } from "../../shared/i18n/language";
import { useSceneContext } from "../../context/scene/useSceneContext";
import { usePortfolioContext } from "../../context/portfolio/usePortfolioContext";
import Navigation from "./Navigation/Navigation";
import Footer from "./Footer/Footer";
import { SECTIONS } from "./browserConfig";
import type { SectionIdType } from "./types";
import WebsiteSection from "./Sections/WebsiteSection/WebsiteSection";
import { BrowserHeader } from "./BrowserHeader/BrowserHeader";
import { useScrollReveal } from "./hooks/useScrollReveal";

interface BrowserShellProps {
	contentRef: RefObject<HTMLDivElement | null>;
	onContentMount: (node: HTMLDivElement | null) => void;
	setSectionRef: (id: string) => (el: HTMLDivElement | null) => void;
	visibleSectionIds: Set<SectionIdType>;
}

export function BrowserShell({
	contentRef,
	onContentMount,
	setSectionRef,
	visibleSectionIds,
}: BrowserShellProps) {
	const { browserMode, language } = usePortfolioContext();
	const { runIntro } = useSceneContext();
	useScrollReveal(contentRef, !runIntro);

	return (
		<div
			className={`browser-container is-${browserMode}`}
			onClick={(event) => event.stopPropagation()}
		>
			<BrowserHeader />

			<div
				className={`browser-content${language === LANGUAGE.HE ? " rtl" : ""}`}
				ref={onContentMount}
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
						<Footer />
					</>
				)}
			</div>
		</div>
	);
}
