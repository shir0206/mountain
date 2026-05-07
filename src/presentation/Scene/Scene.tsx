import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, BakeShadows, Preload } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { EXPERIENCE_PROFILE, type ExperienceProfile, type PresetKey } from "./types";
import {
	CAMERA_PRESETS,
	INITIAL_PRESET,
	PRESET_BUTTONS,
} from "./config/cameraPresets";
import {
	EXPERIENCE_BUDGETS,
	getLowerProfile,
} from "./config/experienceProfiles";
import { getSceneObjectsForProfile } from "./config/sceneObjectPolicy";
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
import { AdaptiveProfile } from "./AdaptiveProfile/AdaptiveProfile";
import { usePortfolioContext } from "../../context/portfolio/usePortfolioContext";
import { BROWSER_MODE } from "../../context/portfolio/types";
import { useDeviceContext } from "../../context/device/useDeviceContext";

// ─── Inner scene (runs inside Canvas) ─────────────────────────────────────────
function SceneInner({
	activePreset,
	introComplete,
	onIntroComplete,
	profile,
	onProfileChange,
}: {
	activePreset: PresetKey;
	introComplete: boolean;
	onIntroComplete: () => void;
	profile: ExperienceProfile;
	onProfileChange: (profile: ExperienceProfile) => void;
}) {
	const controlsRef = useRef<OrbitControlsImpl>(null);
	const openPortfolio = useOpenPortfolio();
	const { browserMode } = usePortfolioContext();
	const budget = EXPERIENCE_BUDGETS[profile];
	const isBrowserOpen = browserMode !== BROWSER_MODE.CLOSED;
	const sceneObjects = getSceneObjectsForProfile(profile);
	const shouldRunRealtimeIntro = budget.enableIntroAnimation;

	useEffect(() => {
		if (!shouldRunRealtimeIntro && !introComplete) {
			onIntroComplete();
		}
	}, [introComplete, onIntroComplete, shouldRunRealtimeIntro]);

	return (
		<>
			<Lighting profile={profile} />
			<CameraTracker controlsRef={controlsRef} />
			<AdaptiveProfile
				profile={profile}
				introComplete={introComplete}
				onProfileChange={onProfileChange}
			/>
			{introComplete && (
				<CameraRig activePreset={activePreset} controlsRef={controlsRef} />
			)}
			{!introComplete && shouldRunRealtimeIntro && (
				<IntroAnimation
					controlsRef={controlsRef}
					onComplete={onIntroComplete}
				/>
			)}

			{/* Single Suspense boundary — nothing renders until ALL models ready */}
			<Suspense fallback={null}>
				{sceneObjects.map((config) => (
					<Model
						key={config.position.join(",")}
						path={config.path}
						position={config.position}
						scale={config.scale}
						rotationY={config.rotationY}
						profile={profile}
					/>
				))}

				{/* Button — opens Browser component */}
				<SceneButton3D
					position={[KEYBOARD_X, KEYBOARD_Y + 0.35, KEYBOARD_Z]}
					color='#e84a6a'
					label={isBrowserOpen ? "" : "Open"}
					onClick={openPortfolio}
					size={0.08}
					hotspot
				/>

				<CodeOnMonitors />

				<ShaderWarmup />
				{budget.shadowMode !== "none" && <BakeShadows />}
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
	const { profile: defaultProfile, setProfile: setContextProfile } =
		useDeviceContext();
	const [profile, setProfile] = useState<ExperienceProfile>(defaultProfile);
	const budget = EXPERIENCE_BUDGETS[profile];

	useEffect(() => {
		setContextProfile(profile);
	}, [profile, setContextProfile]);

	const handleProfileChange = (nextProfile: ExperienceProfile) => {
		setProfile((current) => {
			if (current === nextProfile) return current;
			const lower = getLowerProfile(current);
			if (lower === nextProfile || current === EXPERIENCE_PROFILE.FULL) {
				return nextProfile;
			}
			return current;
		});
	};

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
					antialias: budget.antialias,
					toneMapping: 3 /* ACESFilmic */,
					powerPreference:
						profile === EXPERIENCE_PROFILE.CINEMATIC
							? "default"
							: "high-performance",
				}}
				dpr={[1, budget.maxDpr]}
				shadows={budget.shadowMode === "none" ? false : "soft"}
				onCreated={({ gl }) => {
					gl.setClearColor("#f5ead6");
					gl.localClippingEnabled = true;
				}}
			>
				<SceneInner
					activePreset={activePreset}
					introComplete={introComplete}
					onIntroComplete={() => setIntroComplete(true)}
					profile={profile}
					onProfileChange={handleProfileChange}
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
