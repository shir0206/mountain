import { useState, useRef, useCallback } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// Small glowing disc with floating HTML label; acts as click affordance.
export function SceneButton3D({
	position,
	color,
	label,
	onClick,
	size = 0.18,
	hotspot = false,
}: {
	position: [number, number, number];
	color: string;
	label: string;
	onClick: () => void;
	size?: number;
	hotspot?: boolean;
}) {
	const [hovered, setHovered] = useState(false);
	const meshRef = useRef<THREE.Mesh>(null);
	const hotspotRef = useRef<THREE.Mesh>(null);
	const hotspotMatRef = useRef<THREE.MeshBasicMaterial>(null);

	useFrame(({ clock }) => {
		const t = clock.getElapsedTime();
		if (meshRef.current) {
			// Gentle pulse — stronger on hover.
			const pulse = 1 + Math.sin(t * 2.5) * (hovered ? 0.12 : 0.06);
			meshRef.current.scale.setScalar(pulse);
		}
		if (hotspot && hotspotRef.current && hotspotMatRef.current) {
			// Expanding ring: grows 1.0 → 1.8, opacity 0.55 → 0.
			const phase = (Math.sin(t * 2) + 1) / 2; // 0..1
			const s = 1 + phase * 1.8;
			hotspotRef.current.scale.setScalar(s);
			hotspotMatRef.current.opacity = 0.55 * (1 - phase);
		}
	});

	const handleOver = useCallback((e: ThreeEvent<PointerEvent>) => {
		e.stopPropagation();
		setHovered(true);
		document.body.style.cursor = "pointer";
	}, []);
	const handleOut = useCallback((e: ThreeEvent<PointerEvent>) => {
		e.stopPropagation();
		setHovered(false);
		document.body.style.cursor = "default";
	}, []);
	const handleClick = useCallback(
		(e: ThreeEvent<MouseEvent>) => {
			e.stopPropagation();
			onClick();
		},
		[onClick]
	);

	return (
		<group position={position}>
			<mesh
				ref={meshRef}
				onPointerOver={handleOver}
				onPointerOut={handleOut}
				onClick={handleClick}
			>
				<sphereGeometry args={[size, 24, 24]} />
				<meshStandardMaterial
					color={color}
					emissive={color}
					emissiveIntensity={hovered ? 1.8 : 1.0}
					roughness={0.3}
					metalness={0.1}
					toneMapped={false}
				/>
			</mesh>
			{/* Soft halo ring */}
			<mesh rotation-x={-Math.PI / 2}>
				<ringGeometry args={[size * 1.3, size * 1.9, 32]} />
				<meshBasicMaterial
					color={color}
					transparent
					opacity={hovered ? 0.55 : 0.3}
					side={THREE.DoubleSide}
					toneMapped={false}
				/>
			</mesh>
			{/* Expanding hotspot cue — draws the eye, "click me" */}
			{hotspot && (
				<mesh ref={hotspotRef} rotation-x={-Math.PI / 2}>
					<ringGeometry args={[size * 1.8, size * 2.4, 40]} />
					<meshBasicMaterial
						ref={hotspotMatRef}
						color={color}
						transparent
						opacity={0.55}
						side={THREE.DoubleSide}
						toneMapped={false}
						depthWrite={false}
					/>
				</mesh>
			)}

			{label && (
				<Html
					center
					distanceFactor={8}
					position={[0, size * 2.2, 0]}
					style={{
						pointerEvents: "none",
						fontFamily: "system-ui, sans-serif",
						fontSize: 14,
						fontWeight: 600,
						color: "#fff",
						background: "rgba(30,20,10,0.75)",
						padding: "4px 10px",
						borderRadius: 999,
						whiteSpace: "nowrap",
						opacity: hovered ? 1 : 0.85,
						transition: "opacity 180ms ease",
						userSelect: "none",
					}}
				>
					{label}
				</Html>
			)}
		</group>
	);
}
