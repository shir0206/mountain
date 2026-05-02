import React from "react";

import "./LanguageSwitcher.css";

import { useTranslation } from "../../../../context/portfolio/useTranslation";
import { LANGUAGE } from "../../../../shared/i18n/language";
import type { LanguageType } from "../../../../shared/i18n/types";
import { Icon } from "../../../../shared/components/Icon/Icon";
import { useLanguageDropdown } from "./hooks/useLanguageDropdown";
import { useSwitchLanguage } from "./hooks/useSwitchLanguage";

const LanguageSwitcher: React.FC = () => {
	const { language } = useTranslation();
	const switchLanguage = useSwitchLanguage();

	const {
		isOpen,
		toggleDropdown,
		closeDropdown,
		dropdownRef,
		buttonRef,
		handleButtonKeyDown,
	} = useLanguageDropdown();

	const selectLanguage = (lang: LanguageType) => {
		closeDropdown();
		switchLanguage(lang);
	};

	const handleOptionKeyDown = (
		event: React.KeyboardEvent,
		lang: LanguageType
	) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			selectLanguage(lang);
		}
	};

	return (
		<div
			className={`language-switcher ${isOpen ? "is-open" : ""}`}
			ref={dropdownRef}
		>
			<button
				ref={buttonRef}
				className='language-trigger'
				onClick={toggleDropdown}
				onKeyDown={handleButtonKeyDown}
				aria-haspopup='listbox'
				aria-expanded={isOpen}
				aria-label='Language switcher'
			>
				<Icon name='globe' size={20} className='globe-icon' />
				<span className='language-label'>
					{language === LANGUAGE.EN ? "English" : "עברית"}
				</span>
				<Icon
					name='chevron'
					size={16}
					className={`chevron-icon ${isOpen ? "rotated" : ""}`}
				/>
			</button>

			{isOpen && (
				<div className='language-dropdown'>
					<ul
						role='listbox'
						aria-label='Available languages'
						className='language-options'
					>
						<li
							role='option'
							aria-selected={language === LANGUAGE.EN}
							className={`language-option ${
								language === LANGUAGE.EN ? "active" : ""
							}`}
							onClick={() => selectLanguage(LANGUAGE.EN)}
							onKeyDown={(event) => handleOptionKeyDown(event, LANGUAGE.EN)}
							tabIndex={0}
						>
							<span>English</span>
							{language === LANGUAGE.EN && (
								<Icon name='check' size={16} className='check-icon' />
							)}
						</li>
						<li
							role='option'
							aria-selected={language === LANGUAGE.HE}
							className={`language-option ${
								language === LANGUAGE.HE ? "active" : ""
							}`}
							onClick={() => selectLanguage(LANGUAGE.HE)}
							onKeyDown={(event) => handleOptionKeyDown(event, LANGUAGE.HE)}
							tabIndex={0}
						>
							<span>עברית</span>
							{language === LANGUAGE.HE && (
								<Icon name='check' size={16} className='check-icon' />
							)}
						</li>
					</ul>
				</div>
			)}
		</div>
	);
};

export default LanguageSwitcher;
