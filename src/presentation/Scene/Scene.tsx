import { Suspense, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, BakeShadows, Preload } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { usePortfolioContext } from "../../context/portfolio/usePortfolioContext";
import { BROWSER_MODE } from "../../context/portfolio/types";
import { ErrorBoundary } from "../../shared/components/ErrorBoundary/ErrorBoundary";

import type { PresetKey } from "./types";
import { CAMERA_PRESETS, INITIAL_PRESET, PRESET_BUTTONS } from "./config/cameraPresets";
import { SCENE_OBJECTS } from "./config/sceneObjects";
import { KEYBOARD_X, KEYBOARD_Y, KEYBOARD_Z } from "./config/positions";

import { useOpenPortfolio } from "./hooks/useOpenPortfolio";
import { useChangeCameraPreset } from "./hooks/useChangeCameraPreset";
import { Model } from "./Model/Model";
import { CodeOnMonitors } from "./CodeOnMonitors/CodeOnMonitors";
import { LoaderOverlay } from "./LoaderOverlay/LoaderOverlay";
import { Lighting } from "./Lighting/Lighting";
import { CameraTracker, CameraRig } from "./CameraRig/CameraRig";
import { SceneButton3D } from "./SceneButton3D/SceneButton3D";
import { IntroAnimation } from "./IntroAnimation/IntroAnimation";
import { ShaderWarmup } from "./ShaderWarmup/ShaderWarmup";

// Browser position (above keyboard) — passed to render-prop so Scene stays
// agnostic of the portfolio feature (DDD: Scene ↔ Browser never import each other)
const BROWSER_POSITION: [number, number, number] = [
	KEYBOARD_X,
	KEYBOARD_Y + 1.5,
	KEYBOARD_Z,
];

// ─── Inner scene (runs inside Canvas) ─────────────────────────────────────────
function SceneInner({
	activePreset,
	introComplete,
	onIntroComplete,
	renderPortfolio,
}: {
	activePreset: PresetKey;
	introComplete: boolean;
	onIntroComplete: () => void;
	renderPortfolio?: (position: [number, number, number]) => ReactNode;
}) {
	const controlsRef = useRef<OrbitControlsImpl>(null);
	const { browserMode } = usePortfolioContext();
	const openPortfolio = useOpenPortfolio();

	return (
		<>
			<Lighting />
			<CameraTracker controlsRef={controlsRef} />
			{introComplete && (
				<CameraRig activePreset={activePreset} controlsRef={controlsRef} />
			)}
			{!introComplete && (
				<IntroAnimation
					controlsRef={controlsRef}
					onComplete={onIntroComplete}
				/>
			)}

			{/* Single Suspense boundary — nothing renders until ALL models ready */}
			<Suspense fallback={null}>
				{SCENE_OBJECTS.map((config) => (
					<Model
						key={config.position.join(",")}
						path={config.path}
						position={config.position}
						scale={config.scale}
						rotationY={config.rotationY}
					/>
				))}

				{/* Button — opens Browser component */}
				<SceneButton3D
					position={[KEYBOARD_X, KEYBOARD_Y + 0.35, KEYBOARD_Z]}
					color='#e84a6a'
					label='Open'
					onClick={openPortfolio}
					size={0.08}
					hotspot
				/>

				{/* Portfolio UI rendered via render-prop — keeps Scene free of
				    Browser imports. App composes the two features. */}
				{renderPortfolio && browserMode !== BROWSER_MODE.CLOSED && (
					<ErrorBoundary componentName="Portfolio">
						{renderPortfolio(BROWSER_POSITION)}
					</ErrorBoundary>
				)}

				<CodeOnMonitors />

				<ShaderWarmup />
				<BakeShadows />
				<Preload all />
			</Suspense>

			<OrbitControls
				ref={controlsRef}
				makeDefault
				enableDamping
				dampingFactor={0.05}
				minDistance={0}
				maxDistance={80}
			/>
		</>
	);
}

// ─── Scene (root export — replaces World) ─────────────────────────────────────
interface SceneProps {
	renderPortfolio?: (position: [number, number, number]) => ReactNode;
}

export default function Scene({ renderPortfolio }: SceneProps = {}) {
	const { cameraPreset: activePreset, changeCameraPreset } =
		useChangeCameraPreset();
	const [introComplete, setIntroComplete] = useState(false);

	return (
		<div
			style={{
				position: "relative",
				width: "100vw",
				height: "100vh",
				background: "#f5ead6",
			}}
		>
			<Canvas
				camera={{
					position: CAMERA_PRESETS[INITIAL_PRESET].position,
					fov: 35,
					near: 0.1,
					far: 600,
				}}
				gl={{
					antialias: true,
					toneMapping: 3 /* ACESFilmic */,
					powerPreference: "high-performance",
				}}
				dpr={[1, 2]}
				shadows='soft'
				onCreated={({ gl }) => {
					gl.setClearColor("#f5ead6");
					gl.localClippingEnabled = true;
				}}
			>
				<SceneInner
					activePreset={activePreset}
					introComplete={introComplete}
					onIntroComplete={() => setIntroComplete(true)}
					renderPortfolio={renderPortfolio}
				/>
			</Canvas>

			{/* 2D overlay fallback buttons (accessibility + visibility guarantee) */}
			<div
				style={{
					position: "fixed",
					bottom: 20,
					left: "50%",
					transform: "translateX(-50%)",
					display: "flex",
					gap: 10,
					zIndex: 5,
					fontFamily: "system-ui, sans-serif",
				}}
			>
				{PRESET_BUTTONS.map((button) => (
					<button
						key={button.key}
						onClick={() => changeCameraPreset(button.key)}
						style={{
							background:
								activePreset === button.key
									? button.color
									: "rgba(30,20,10,0.75)",
							color: "#fff",
							border: "none",
							padding: "8px 16px",
							borderRadius: 999,
							fontSize: 13,
							fontWeight: 600,
							cursor: "pointer",
							boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
						}}
					>
						{button.label}
					</button>
				))}
			</div>

			<LoaderOverlay />
		</div>
	);
}
