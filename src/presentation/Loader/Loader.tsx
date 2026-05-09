import { useEffect, useRef } from "react";
import { useProgress } from "@react-three/drei";
import "./Loader.css";

function Bar({ cls }: { cls: string }) {
	return (
		<div className={`loader-bar ${cls}`}>
			<div className="loader-face loader-face-front" />
			<div className="loader-face loader-face-left" />
		</div>
	);
}

interface LoaderProps {
	onLoaded: () => void;
}

export function Loader({ onLoaded }: LoaderProps) {
	const { active, progress } = useProgress();
	const calledRef = useRef(false);

	useEffect(() => {
		if (!active && progress >= 100 && !calledRef.current) {
			calledRef.current = true;
			onLoaded();
		}
	}, [active, progress, onLoaded]);

	return (
		<div className="loader-screen">
			<div className="loader-mountain">
				<div className="loader-bars">
					{/* Sec ring */}
					<Bar cls="loader-bar-sec lbs1" />
					<Bar cls="loader-bar-sec lbs2" />
					<Bar cls="loader-bar-sec lbs3" />
					<Bar cls="loader-bar-sec lbs4" />
					<Bar cls="loader-bar-sec lbs5" />
					<Bar cls="loader-bar-sec lbs6" />
					<Bar cls="loader-bar-sec lbs7" />
					<Bar cls="loader-bar-sec lbs8" />
					<Bar cls="loader-bar-sec lbs9" />
					<Bar cls="loader-bar-sec lbs10" />
					<Bar cls="loader-bar-sec lbs11" />
					<Bar cls="loader-bar-sec lbs12" />
					<Bar cls="loader-bar-sec lbs13" />
					<Bar cls="loader-bar-sec lbs14" />
					<Bar cls="loader-bar-sec lbs15" />
					<Bar cls="loader-bar-sec lbs16" />
					<Bar cls="loader-bar-sec lbs26" />
					<Bar cls="loader-bar-sec lbs27" />
					<Bar cls="loader-bar-sec lbs28" />
					<Bar cls="loader-bar-sec lbs29" />
					<Bar cls="loader-bar-sec lbs30" />
					<Bar cls="loader-bar-sec lbs31" />
					<Bar cls="loader-bar-sec lbs32" />
					{/* Outer ring */}
					<Bar cls="loader-bar-outer lbo1" />
					<Bar cls="loader-bar-outer lbo2" />
					<Bar cls="loader-bar-outer lbo3" />
					<Bar cls="loader-bar-outer lbo4" />
					<Bar cls="loader-bar-outer lbo5" />
					<Bar cls="loader-bar-outer lbo6" />
					<Bar cls="loader-bar-outer lbo7" />
					<Bar cls="loader-bar-outer lbo8" />
					<Bar cls="loader-bar-outer lbo9" />
					<Bar cls="loader-bar-outer lbo10" />
					<Bar cls="loader-bar-outer lbo11" />
					<Bar cls="loader-bar-outer lbo12" />
					<Bar cls="loader-bar-outer lbo13" />
					<Bar cls="loader-bar-outer lbo14" />
					<Bar cls="loader-bar-outer lbo15" />
					<Bar cls="loader-bar-outer lbo16" />
					<Bar cls="loader-bar-outer lbo17" />
					<Bar cls="loader-bar-outer lbo18" />
					<Bar cls="loader-bar-outer lbo19" />
					<Bar cls="loader-bar-outer lbo20" />
					<Bar cls="loader-bar-outer lbo21" />
					<Bar cls="loader-bar-outer lbo22" />
					<Bar cls="loader-bar-outer lbo23" />
					<Bar cls="loader-bar-outer lbo24" />
					{/* Mid ring */}
					<Bar cls="loader-bar-mid lbm1" />
					<Bar cls="loader-bar-mid lbm2" />
					<Bar cls="loader-bar-mid lbm3" />
					<Bar cls="loader-bar-mid lbm4" />
					<Bar cls="loader-bar-mid lbm5" />
					<Bar cls="loader-bar-mid lbm6" />
					<Bar cls="loader-bar-mid lbm7" />
					<Bar cls="loader-bar-mid lbm8" />
					<Bar cls="loader-bar-mid lbm9" />
					<Bar cls="loader-bar-mid lbm10" />
					<Bar cls="loader-bar-mid lbm11" />
					<Bar cls="loader-bar-mid lbm12" />
					<Bar cls="loader-bar-mid lbm13" />
					<Bar cls="loader-bar-mid lbm14" />
					<Bar cls="loader-bar-mid lbm15" />
					<Bar cls="loader-bar-mid lbm16" />
					{/* Inner ring */}
					<Bar cls="loader-bar-inner lbi1" />
					<Bar cls="loader-bar-inner lbi2" />
					<Bar cls="loader-bar-inner lbi3" />
					<Bar cls="loader-bar-inner lbi4" />
					<Bar cls="loader-bar-inner lbi5" />
					<Bar cls="loader-bar-inner lbi6" />
					<Bar cls="loader-bar-inner lbi7" />
					<Bar cls="loader-bar-inner lbi8" />
					{/* Core */}
					<Bar cls="loader-bar-core lbc1" />
				</div>
			</div>

			<div className="loader-progress">
				<div className="loader-progress__track">
					<div
						className="loader-progress__fill"
						style={{ width: `${Math.round(progress)}%` }}
					/>
				</div>
				<span className="loader-progress__text">
					{Math.round(progress)}%
				</span>
			</div>
		</div>
	);
}