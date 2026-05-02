import React from "react";

import "./Navigation.css";

import { useTranslation } from "../../../context/portfolio/useTranslation";
import { SECTION_IDS, type SectionIdType } from "../types";
import { useScrollNavigation } from "./hooks/useScrollNavigation";
import LanguageSwitcher from "./LanguageSwitcher/LanguageSwitcher";

interface NavigationItem {
	id: SectionIdType;
	label: string;
}

interface NavigationProps {
	containerRef: React.RefObject<HTMLDivElement | null>;
}

const Navigation: React.FC<NavigationProps> = ({ containerRef }) => {
	const { t } = useTranslation();

	// Navigation items based on sections
	const navigationItems: NavigationItem[] = [
		{ id: SECTION_IDS.OVERVIEW, label: t.navigation.overview },
		{ id: SECTION_IDS.ABOUT, label: t.navigation.about },
		{ id: SECTION_IDS.SERVICE, label: t.navigation.service },
		{ id: SECTION_IDS.CONTACT, label: t.navigation.contact },
	];

	// Use the scroll navigation hook
	const { activeSection, isScrolled, scrollToSection } = useScrollNavigation({
		containerRef,
	});

	const handleSectionClick = (sectionId: SectionIdType) => {
		scrollToSection(sectionId);
	};

	return (
		<nav className={`navigation ${isScrolled ? "is-scrolled" : ""}`}>
			<div className='navigation-container'>
				<div className='navigation-links'>
					{navigationItems.map((item) => (
						<button
							key={item.id}
							className={`navigation-link ${
								activeSection === item.id ? "active" : ""
							}`}
							onClick={() => handleSectionClick(item.id)}
							aria-label={`Navigate to ${item.label}`}
						>
							{item.label}
						</button>
					))}
				</div>
				<div className='navigation-actions'>
					<LanguageSwitcher />
				</div>
			</div>
		</nav>
	);
};

export default Navigation;
