import React, { useCallback } from "react";

import "../Browser.css";

import { useTranslation } from "../../../context/portfolio/useTranslation";
import { Icon } from "../../../shared/components/Icon/Icon";
import { usePortfolioContext } from "../../../context/portfolio/usePortfolioContext";
import { BROWSER_MODE } from "../../../context/portfolio/types";
import { useClosePortfolio } from "../hooks/useClosePortfolio";

export const BrowserHeader: React.FC = () => {
	const { browserMode, setBrowserMode } = usePortfolioContext();
	const { t } = useTranslation();
	const handleClose = useClosePortfolio();

	const handleMinimize = useCallback(() => {
		setBrowserMode(
			browserMode === BROWSER_MODE.MINIMIZED
				? BROWSER_MODE.OPEN
				: BROWSER_MODE.MINIMIZED
		);
	}, [setBrowserMode, browserMode]);

	const handleMaximize = useCallback(() => {
		setBrowserMode(
			browserMode === BROWSER_MODE.MAXIMIZED
				? BROWSER_MODE.OPEN
				: BROWSER_MODE.MAXIMIZED
		);
	}, [setBrowserMode, browserMode]);

	return (
		<div className='browser-header'>
			<div className='window-controls'>
				<button
					className='window-control window-control-close'
					onClick={handleClose}
					aria-label={t.browser.windowControls.close}
				>
					<Icon name='close' className='window-control-icon' size={8} />
				</button>
				<button
					className='window-control window-control-minimize'
					onClick={handleMinimize}
					aria-label={t.browser.windowControls.minimize}
				>
					<Icon name='minimize' className='window-control-icon' size={8} />
				</button>
				<button
					className='window-control window-control-maximize'
					onClick={handleMaximize}
					aria-label={t.browser.windowControls.maximize}
				>
					<Icon name='maximize' className='window-control-icon' size={10} />
				</button>
			</div>

			{/* <div className="browser-title">{t.browser.title}</div> */}
		</div>
	);
};
