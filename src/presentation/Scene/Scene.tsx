import { Suspense, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, BakeShadows, Preload } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

import { useDeviceContext } from "../../context/device/useDeviceContext";
import { DEVICE } from "../../context/device/types";
import type { PresetKey } from "./types";
import {
	CAMERA_PRESETS,
	INITIAL_PRESET,
	PRESET_BUTTONS,
} from "./config/cameraPresets";
import { SCENE_OBJECTS } from "./config/sceneObjects";
import { KEYBOARD_X, KEYBOARD_Y, KEYBOARD_Z } from "./config/positions";

import { useOpenPortfolio } from "./hooks/useOpenPortfolio";
import { useChangeCameraPreset } from "./hooks/useChangeCameraPreset";
import { Model } from "./Model/Model";
import { CodeOnMonitors } from "./CodeOnMonitors/CodeOnMonitors";
import { Lighting } from "./Lighting/Lighting";
import { CameraTracker, CameraRig } from "./CameraRig/CameraRig";
import { SceneButton3D } from "./SceneButton3D/SceneButton3D";
import { IntroAnimation } from "./IntroAnimation/IntroAnimation";
import { ShaderWarmup } from "./ShaderWarmup/ShaderWarmup";
import { usePortfolioContext } from "../../context/portfolio/usePortfolioContext";
import { BROWSER_MODE } from "../../context/portfolio/types";

// ─── Responsive FOV (adjusts camera FOV based on device) ──────────────────────
function ResponsiveFov({ isMobile }: { isMobile: boolean }) {
	const { camera } = useThree();
	const fov = isMobile ? 55 : 35;
	if ((camera as THREE.PerspectiveCamera).fov !== fov) {
		(camera as THREE.PerspectiveCamera).fov = fov;
		camera.updateProjectionMatrix();
	}
	return null;
}

// ─── Inner scene (runs inside Canvas) ─────────────────────────────────────────
function SceneInner({
	activePreset,
	introComplete,
	onIntroComplete,
	isMobile,
}: {
	activePreset: PresetKey;
	introComplete: boolean;
	onIntroComplete: () => void;
	isMobile: boolean;
}) {
	const controlsRef = useRef<OrbitControlsImpl>(null);
	const openPortfolio = useOpenPortfolio();
	const { browserMode } = usePortfolioContext();
	const isBrowserOpen = browserMode !== BROWSER_MODE.CLOSED;

	return (
		<>
			<ResponsiveFov isMobile={isMobile} />
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
					position={[KEYBOARD_X + 0.8, KEYBOARD_Y + 0.35, KEYBOARD_Z - 0.1]}
					color='#e84a6a'
					label={isBrowserOpen ? "" : "Open"}
					onClick={openPortfolio}
					size={0.08}
					hotspot
				/>

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
export default function Scene() {
	const { cameraPreset: activePreset, changeCameraPreset } =
		useChangeCameraPreset();
	const [introComplete, setIntroComplete] = useState(false);
	const { device } = useDeviceContext();
	const isMobile = device === DEVICE.MOBILE;

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
					fov: isMobile ? 55 : 35,
					near: 0.1,
					far: 600,
				}}
				gl={{
					antialias: true,
					toneMapping: 3 /* ACESFilmic */,
					powerPreference: "high-performance",
				}}
				dpr={isMobile ? [1, 1.5] : [1, 2]}
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
					isMobile={isMobile}
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
		</div>
	);
}
