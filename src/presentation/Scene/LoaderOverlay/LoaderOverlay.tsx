import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

// Full-screen loader overlay — fades out only when all GLBs are ready.
export function LoaderOverlay() {
	const { active, progress } = useProgress();
	const [hidden, setHidden] = useState(false);

	useEffect(() => {
		if (!active && progress >= 100) {
			const timeoutId = setTimeout(() => setHidden(true), 450);
			return () => clearTimeout(timeoutId);
		}
	}, [active, progress]);

	if (hidden) return null;

	return (
		<div
			style={{
				position: "fixed",
				inset: 0,
				background: "#f5ead6",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 10,
				opacity: !active && progress >= 100 ? 0 : 1,
				transition: "opacity 400ms ease",
				pointerEvents: !active && progress >= 100 ? "none" : "auto",
				fontFamily: "system-ui, sans-serif",
				color: "#7a5a2e",
			}}
		>
			<div
				style={{
					width: 220,
					height: 4,
					background: "#e6d5a8",
					borderRadius: 2,
					overflow: "hidden",
				}}
			>
				<div
					style={{
						width: `${progress}%`,
						height: "100%",
						background: "#c68a3a",
						transition: "width 200ms ease",
					}}
				/>
			</div>
			<div style={{ marginTop: 12, fontSize: 13, letterSpacing: 0.5 }}>
				{Math.round(progress)}%
			</div>
		</div>
	);
}
