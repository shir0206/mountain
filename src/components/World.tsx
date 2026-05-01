import {
	Suspense,
	useMemo,
	useRef,
	useEffect,
	useState,
	useCallback,
} from "react";
import {
	Canvas,
	useFrame,
	useThree,
	type ThreeEvent,
} from "@react-three/fiber";
import {
	OrbitControls,
	useGLTF,
	Float,
	BakeShadows,
	Preload,
	useProgress,
	Html,
} from "@react-three/drei";
import type { GLTF, OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

const MOUNTAIN_SCALE = 80;
const MOUNTAIN_Y = -50;
const PEAK_WORLD_Y = MOUNTAIN_Y + 0.23 * MOUNTAIN_SCALE;

const TERRACE_X = -5;
const TERRACE_Y = PEAK_WORLD_Y - 0.5;
const TERRACE_Z = -8;

const PERGOLA_X = 8;
const PERGOLA_Y = PEAK_WORLD_Y - 11;
const PERGOLA_Z = -15;
const PERGOLA_SCALE = 0.05; //0.003;
const PERGOLA_ANGLE = Math.PI;

const BAR_TABLE_X = PERGOLA_X - 9.2;
const BAR_TABLE_Y = PERGOLA_Y + 7.8;
const BAR_TABLE_Z = PERGOLA_Z - 0.1;
const BAR_TABLE_SCALE = 0.01;

const PLANT_MONEY_X = BAR_TABLE_X;
const PLANT_MONEY_Y = BAR_TABLE_Y + 0.95;
const PLANT_MONEY_Z = BAR_TABLE_Z;
const PLANT_MONEY_SCALE = 0.5;

const BAR_CHAIR_FIRST_X = BAR_TABLE_X;
const BAR_CHAIR_FIRST_Y = BAR_TABLE_Y;
const BAR_CHAIR_FIRST_Z = BAR_TABLE_Z + 0.5;
const BAR_CHAIR_FIRST_SCALE = 0.01;
const BAR_CHAIR_FIRST_ANGLE = Math.PI;

const BAR_CHAIR_SECOND_X = BAR_TABLE_X - 0.5;
const BAR_CHAIR_SECOND_Y = BAR_TABLE_Y;
const BAR_CHAIR_SECOND_Z = BAR_TABLE_Z;
const BAR_CHAIR_SECOND_SCALE = 0.01;
const BAR_CHAIR_SECOND_ANGLE = Math.PI / 2;

const SHELF_X = TERRACE_X + 9.5;
const SHELF_Y = TERRACE_Y - 2.7;
const SHELF_Z = TERRACE_Z - 4;
const SHELF_SCALE = 1.8;

const FRUITS_X = SHELF_X + 1.2; //- 0.7;
const FRUITS_Y = SHELF_Y + 0.83;
const FRUITS_Z = SHELF_Z;
const FRUITS_SCALE = 1.7;

const TEA_X = SHELF_X - 0.1; //+ 0.5;
const TEA_Y = SHELF_Y + 0.85;
const TEA_Z = SHELF_Z;
const TEA_SCALE = 1.4;
const TEA_ANGLE = Math.PI / 2;

const COFFEE_X = SHELF_X - 1; //+ 1.2;
const COFFEE_Y = SHELF_Y + 0.8;
const COFFEE_Z = SHELF_Z;
const COFFEE_SCALE = 35;

const MUD_X = PERGOLA_X - 4;
const MUD_Y = PERGOLA_Y + 7.82;
const MUD_Z = PERGOLA_Z + 10.5;
const MUD_SCALE = 0.01;

const WOODEN_FENCE_A_X = MUD_X + 7.25;
const WOODEN_FENCE_B_X = MUD_X + 4;
const WOODEN_FENCE_C_X = MUD_X + 0.75;
const WOODEN_FENCE_D_X = MUD_X - 2.25;
const WOODEN_FENCE_E_X = MUD_X - 5.4;
const WOODEN_FENCE_Y = MUD_Y;
const WOODEN_FENCE_Z = MUD_Z - 1.5;
const WOODEN_FENCE_SCALE = 0.5;
const WOODEN_FENCE_ANGLE = -Math.PI / 2;

const PLANT_GERANIUM_A_X = MUD_X + 4;
const PLANT_GERANIUM_B_X = MUD_X - 1;
const PLANT_GERANIUM_C_X = MUD_X - 4.7;
const PLANT_GERANIUM_D_X = MUD_X + 1.3;
const PLANT_GERANIUM_E_X = MUD_X + 7;
const PLANT_GERANIUM_Y = MUD_Y;
const PLANT_GERANIUM_A_Z = MUD_Z - 1.1;
const PLANT_GERANIUM_B_Z = MUD_Z - 1.2;
const PLANT_GERANIUM_C_Z = MUD_Z - 0.7;
const PLANT_GERANIUM_D_Z = MUD_Z - 0.6;
const PLANT_GERANIUM_E_Z = MUD_Z - 0.55;
const PLANT_GERANIUM_SCALE = 0.8;
const PLANT_GERANIUM_C_SCALE = 1;
const PLANT_GERANIUM_A_ANGLE = Math.PI * 1.5;
const PLANT_GERANIUM_B_ANGLE = Math.PI;
const PLANT_GERANIUM_C_ANGLE = -Math.PI;
const PLANT_GERANIUM_D_ANGLE = Math.PI * 1.1;
const PLANT_GERANIUM_E_ANGLE = -Math.PI * 0.9;

const PLANT_PALM_A_X = MUD_X + 2.5;
const PLANT_PALM_B_X = MUD_X - 1;
const PLANT_PALM_Y = MUD_Y;
const PLANT_PALM_A_Z = MUD_Z + 0.2;
const PLANT_PALM_B_Z = MUD_Z - 0.2;
const PLANT_PALM_A_SCALE = 2;
const PLANT_PALM_B_SCALE = 1.6;
const PLANT_PALM_A_ANGLE = Math.PI * 1.5;
const PLANT_PALM_B_ANGLE = Math.PI;

const PLANT_LUPINE_A_X = MUD_X + 6;
const PLANT_LUPINE_B_X = MUD_X - 3.5;
const PLANT_LUPINE_C_X = MUD_X + 8.5;
const PLANT_LUPINE_D_X = MUD_X + 2;
const PLANT_LUPINE_Y = MUD_Y;
const PLANT_LUPINE_A_Z = MUD_Z - 1;
const PLANT_LUPINE_B_Z = MUD_Z - 0.9;
const PLANT_LUPINE_C_Z = MUD_Z - 0.4;
const PLANT_LUPINE_D_Z = MUD_Z - 0.4;
const PLANT_LUPINE_A_SCALE = 1;
const PLANT_LUPINE_B_SCALE = 0.8;
const PLANT_LUPINE_C_SCALE = 0.95;
const PLANT_LUPINE_D_SCALE = 0.85;
const PLANT_LUPINE_A_ANGLE = Math.PI * 1.5;
const PLANT_LUPINE_B_ANGLE = Math.PI;
const PLANT_LUPINE_C_ANGLE = Math.PI * 1.6;
const PLANT_LUPINE_D_ANGLE = Math.PI * 0.9;

const PLANT_SNOWFLAKE_A_X = MUD_X + 5;
const PLANT_SNOWFLAKE_B_X = MUD_X;
const PLANT_SNOWFLAKE_C_X = MUD_X + 5.3;
const PLANT_SNOWFLAKE_D_X = MUD_X - 0.4;
const PLANT_SNOWFLAKE_Y = MUD_Y;
const PLANT_SNOWFLAKE_A_Z = MUD_Z - 1;
const PLANT_SNOWFLAKE_B_Z = MUD_Z - 0.7;
const PLANT_SNOWFLAKE_C_Z = MUD_Z - 0.15;
const PLANT_SNOWFLAKE_D_Z = MUD_Z - 0.1;
const PLANT_SNOWFLAKE_A_SCALE = 0.6;
const PLANT_SNOWFLAKE_B_SCALE = 0.7;
const PLANT_SNOWFLAKE_C_SCALE = 0.65;
const PLANT_SNOWFLAKE_D_SCALE = 0.75;
const PLANT_SNOWFLAKE_A_ANGLE = Math.PI * 1.5;
const PLANT_SNOWFLAKE_B_ANGLE = Math.PI;
const PLANT_SNOWFLAKE_C_ANGLE = Math.PI * 1.4;
const PLANT_SNOWFLAKE_D_ANGLE = Math.PI * 1.1;

const PLANT_CROTON_A_X = MUD_X + 8;
const PLANT_CROTON_B_X = MUD_X - 5.5;
const PLANT_CROTON_C_X = MUD_X + 3;
const PLANT_CROTON_D_X = MUD_X + 1.5;
const PLANT_CROTON_Y = MUD_Y;
const PLANT_CROTON_A_Z = MUD_Z - 1.15;
const PLANT_CROTON_B_Z = MUD_Z - 1.2;
const PLANT_CROTON_C_Z = MUD_Z - 0.35;
const PLANT_CROTON_D_Z = MUD_Z - 1.1;
const PLANT_CROTON_A_SCALE = 0.25;
const PLANT_CROTON_B_SCALE = 0.22;
const PLANT_CROTON_C_SCALE = 0.24;
const PLANT_CROTON_D_SCALE = 0.28;
const PLANT_CROTON_A_ANGLE = Math.PI * 1.5;
const PLANT_CROTON_B_ANGLE = -Math.PI * 1.5;
const PLANT_CROTON_C_ANGLE = Math.PI * 1.85;
const PLANT_CROTON_D_ANGLE = Math.PI / 2;

const PLANT_SINENSIS_A_X = MUD_X - 2.5;
const PLANT_SINENSIS_B_X = MUD_X - 6.5;
const PLANT_SINENSIS_Y = MUD_Y - 1.6;
const PLANT_SINENSIS_A_Z = MUD_Z - 0.6;
const PLANT_SINENSIS_B_Z = MUD_Z - 0.6;
const PLANT_SINENSIS_A_SCALE = 1.4;
const PLANT_SINENSIS_B_SCALE = 1.2;
const PLANT_SINENSIS_A_ANGLE = 0;
const PLANT_SINENSIS_B_ANGLE = Math.PI;

const PLANT_BUSH_A_X = MUD_X + 8;
const PLANT_BUSH_B_X = MUD_X + 6;
const PLANT_BUSH_C_X = MUD_X + 4;
const PLANT_BUSH_D_X = MUD_X + 1;
const PLANT_BUSH_Y = MUD_Y;
const PLANT_BUSH_A_Z = MUD_Z + 0.5;
const PLANT_BUSH_B_Z = MUD_Z + 0.5;
const PLANT_BUSH_C_Z = MUD_Z + 0.35;
const PLANT_BUSH_D_Z = MUD_Z + 0.35;
const PLANT_BUSH_A_SCALE = 1.7;
const PLANT_BUSH_B_SCALE = 1.8;
const PLANT_BUSH_C_SCALE = 1.6;
const PLANT_BUSH_D_SCALE = 1.6;
const PLANT_BUSH_A_ANGLE = Math.PI * 1.5;
const PLANT_BUSH_B_ANGLE = -Math.PI * 1.5;
const PLANT_BUSH_C_ANGLE = Math.PI * 1.75;
const PLANT_BUSH_D_ANGLE = Math.PI * 1.85;

const DESK_X = PERGOLA_X + 1.85;
const DESK_Y = PERGOLA_Y + 7.8;
const DESK_Z = PERGOLA_Z + 3.5;
const DESK_SCALE = 0.015;

const MUG_X = DESK_X + 1.5;
const MUG_Y = DESK_Y + 0.98;
const MUG_Z = DESK_Z - 0.25;
const MUG_SCALE = 0.02;
const MUG_ANGLE = Math.PI * 0.8;

const COASTER_X = MUG_X + 0.28;
const COASTER_Y = MUG_Y;
const COASTER_Z = MUG_Z + 0.17;
const COASTER_SCALE = 0.15;
const COASTER_ANGLE = Math.PI * 0.8;

const MONITOR_A_X = DESK_X - 3.47;
const MONITOR_A_Y = DESK_Y + 0.62;
const MONITOR_A_Z = DESK_Z + 0.4;
const MONITOR_A_ANGLE = Math.PI * 0.08;

const MONITOR_B_X = DESK_X - 2.7;
const MONITOR_B_Y = DESK_Y + 0.62;
const MONITOR_B_Z = DESK_Z - 0.5;
const MONITOR_B_ANGLE = 0;

const MONITOR_C_X = DESK_X - 1.67;
const MONITOR_C_Y = DESK_Y + 0.62;
const MONITOR_C_Z = DESK_Z - 1.35;
const MONITOR_C_ANGLE = -Math.PI * 0.1;

const KEYBOARD_X = DESK_X;
const KEYBOARD_Y = DESK_Y + 0.98;
const KEYBOARD_Z = DESK_Z + 0.5;

const PAD_X = DESK_X;
const PAD_Y = DESK_Y - 1.1;
const PAD_Z = DESK_Z - 0.6;
const PAD_SCALE = 0.4;
const PAD_ANGLE = Math.PI * 1.5;

const LAPTOP_X = DESK_X - 1;
const LAPTOP_Y = DESK_Y + 1;
const LAPTOP_Z = DESK_Z;

const DESK_LAMP_X = DESK_X - 1.5;
const DESK_LAMP_Y = DESK_Y + 1.38;
const DESK_LAMP_Z = DESK_Z - 0.4;
const DESK_LAMP_SCALE = 0.8;
const DESK_LAMP_ANGLE = -Math.PI * 1.5;

const MOUSE_X = DESK_X + 0.6;
const MOUSE_Y = DESK_Y + 0.98;
const MOUSE_Z = DESK_Z + 0.3;

const OFFICE_CHAIR_X = DESK_X;
const OFFICE_CHAIR_Y = DESK_Y + 0.02;
const OFFICE_CHAIR_Z = DESK_Z + 1.0;
const OFFICE_CHAIR_SCALE = 0.015;

const COFFEE_TABLE_X = PERGOLA_X - 8;
const COFFEE_TABLE_Y = PERGOLA_Y + 7.8;
const COFFEE_TABLE_Z = TERRACE_Z - 1;
const COFFEE_TABLE_SCALE = 0.01;

const TABLET_X = COFFEE_TABLE_X - 0.2;
const TABLET_Y = COFFEE_TABLE_Y + 0.3;
const TABLET_Z = COFFEE_TABLE_Z + 0.2;
const TABLET_SCALE = 1.5;
const TABLET_ANGLE = Math.PI * 1.5;

const TV_X = PERGOLA_X - 7.75;
const TV_Y = PERGOLA_Y + 8.2;
const TV_Z = PERGOLA_Z + 3.4;
const TV_SCALE = 0.8;
const TV_ANGLE = Math.PI * 2;

const TV_CODE_X = TV_X - 0.02;
const TV_CODE_Y = TV_Y + 0.7;
const TV_CODE_Z = TV_Z + 0.01;
const TV_CODE_SCALE = 1;
const TV_CODE_ANGLE = Math.PI * 2;

const PLANT_SQUARE_X = PERGOLA_X - 8;
const PLANT_SQUARE_Y = PERGOLA_Y + 7.5;
const PLANT_SQUARE_Z = PERGOLA_Z + 2.7;
const PLANT_SQUARE_SCALE = 0.1;
const PLANT_SQUARE_ANGLE = Math.PI * 1.5;

const PLANT_SQUARE_B_X = PERGOLA_X - 11;
const PLANT_SQUARE_B_Z = PERGOLA_Z + 8.1;
const PLANT_SQUARE_B_ANGLE = Math.PI;

const PLANT_SQUARE_C_X = PERGOLA_X - 8.8;
const PLANT_SQUARE_C_Z = PERGOLA_Z + 10;
const PLANT_SQUARE_C_ANGLE = Math.PI * 1.5;

const PLANT_CREEPER_LEFT_X = PERGOLA_X - 11;
const PLANT_CREEPER_LEFT_Y = PERGOLA_Y + 7.9;
const PLANT_CREEPER_LEFT_Z = PERGOLA_Z + 0.2;
const PLANT_CREEPER_LEFT_SCALE = 0.00007;
const PLANT_CREEPER_LEFT_ANGLE = -Math.PI * 1.5;

const PLANT_CREEPER_RIGHT_X = PERGOLA_X - 11;
const PLANT_CREEPER_RIGHT_Y = PERGOLA_Y + 7.6;
const PLANT_CREEPER_RIGHT_Z = PERGOLA_Z + 1.5;
const PLANT_CREEPER_RIGHT_SCALE = 0.00007;
const PLANT_CREEPER_RIGHT_ANGLE = Math.PI * 1.4;

const FLOOR_LAMP_X = COFFEE_TABLE_X - 1;
const FLOOR_LAMP_Y = COFFEE_TABLE_Y + 0.01;
const FLOOR_LAMP_Z = COFFEE_TABLE_Z + 1.8;
const FLOOR_LAMP_SCALE = 0.01;
const FLOOR_LAMP_ANGLE = Math.PI;

const ARMCHAIR_X = COFFEE_TABLE_X + 0.2;
const ARMCHAIR_Y = COFFEE_TABLE_Y + 0.01;
const ARMCHAIR_Z = COFFEE_TABLE_Z + 1.6;
const ARMCHAIR_SCALE = 0.012;
const ARMCHAIR_ANGLE = Math.PI;

const SOFA_X = COFFEE_TABLE_X - 1.25;
const SOFA_Y = COFFEE_TABLE_Y + 0.01;
const SOFA_Z = COFFEE_TABLE_Z + 0.2;
const SOFA_SCALE = 0.01;
const SOFA_ANGLE = Math.PI / 2;

const PILLOW_X = SOFA_X - 0.1;
const PILLOW_Y = SOFA_Y + 0.13;
const PILLOW_Z = SOFA_Z - 0.6;
const PILLOW_SCALE = 0.0007;
const PILLOW_ANGLE = -Math.PI / 4;

const RUG_MEETING_X = COFFEE_TABLE_X - 0.5;
const RUG_MEETING_Y = COFFEE_TABLE_Y + 0.01;
const RUG_MEETING_Z = COFFEE_TABLE_Z + 0.5;
const RUG_MEETING_SCALE = 2.2;

const RUG_OFFICE_X = DESK_X - 0.1;
const RUG_OFFICE_Y = DESK_Y + 0.02;
const RUG_OFFICE_Z = DESK_Z + 0.8;
const RUG_OFFICE_SCALE = 2;
const RUG_OFFICE_ANGLE = Math.PI / 2;

const BOOKCASE_X = DESK_X + 2.1;
const BOOKCASE_Y = DESK_Y;
const BOOKCASE_Z = DESK_Z + 1.1;
const BOOKCASE_SCALE = 0.01;
const BOOKCASE_ANGLE = Math.PI * 1.5;

interface ModelConfig {
	path: string;
	label: string;
	position: [number, number, number];
	scale: number | [number, number, number];
	floatSpeed: number;
	floatIntensity: number;
	rotationY?: number;
	// When true, mesh is excluded from shadow casting/receiving.
	// Set on dense vegetation to drastically reduce shadow-pass cost.
	noShadow?: boolean;
}

// Vegetation / high-poly plant models — excluded from shadow passes.
// These leaves explode shadow draw calls without adding visual value
// (shadows are soft/blurry under the sun anyway).
const NO_SHADOW_PATHS = new Set<string>([
	"models_optimized/green_creeper_plant.glb",
	"models_optimized/bush_square.glb",
	"models_optimized/realistic_hd_chinese_jungle_geranium_310.glb",
	"models_optimized/realistic_hd_chinese_jungle_geranium_710.glb",
	"models_optimized/realistic_hd_windmill_palm_1625.glb",
	"models_optimized/realistic_hd_large-leaved_lupine_318.glb",
	"models_optimized/dwarf_snowflake_mock_orange_flowers_spring.glb",
	"models_optimized/croton_leaf_plants.glb",
	"models_optimized/wisteria_sinensis005.glb",
	"models_optimized/free_pothos_potted_plant_-_money_plant.glb",
]);

const MODEL_CONFIG: ModelConfig[] = [
	{
		path: "models_optimized/weisse_wand_mountain_peek_2517_m_8257_ft_m.glb",
		label: "Mountain Peak",
		position: [0, MOUNTAIN_Y, 0],
		scale: MOUNTAIN_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
	},
	{
		path: "models_optimized/pergola.glb",
		label: "Glass Terrace",
		position: [PERGOLA_X, PERGOLA_Y, PERGOLA_Z],
		scale: [PERGOLA_SCALE * 0.8, PERGOLA_SCALE * 0.5, PERGOLA_SCALE * 1.2],
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PERGOLA_ANGLE,
	},

	{
		path: "models_optimized/jenson_extending_dining_table_solid_oak.glb",
		label: "Desk",
		position: [DESK_X, DESK_Y, DESK_Z],
		scale: [DESK_SCALE * 1.8, DESK_SCALE * 0.9, DESK_SCALE * 1.2],
		floatSpeed: 0,
		floatIntensity: 0,
	},

	{
		path: "models_optimized/harvey_swivel_chair_mineral_blue.glb",
		label: "Chair",
		position: [OFFICE_CHAIR_X, OFFICE_CHAIR_Y, OFFICE_CHAIR_Z],
		scale: OFFICE_CHAIR_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: Math.PI,
	},

	{
		path: "models_optimized/monitor.glb",
		label: "Monitor Left",
		position: [MONITOR_A_X, MONITOR_A_Y, MONITOR_A_Z],
		scale: 1.2,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: MONITOR_A_ANGLE,
	},
	{
		path: "models_optimized/monitor.glb",
		label: "Monitor Right",
		position: [MONITOR_B_X, MONITOR_B_Y, MONITOR_B_Z],
		scale: 1.2,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: MONITOR_B_ANGLE,
	},
	{
		path: "models_optimized/monitor.glb",
		label: "Monitor Right",
		position: [MONITOR_C_X, MONITOR_C_Y, MONITOR_C_Z],
		scale: 1.2,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: MONITOR_C_ANGLE,
	},

	{
		path: "models_optimized/mac_keyboard.glb",
		label: "Keyboard",
		position: [KEYBOARD_X, KEYBOARD_Y, KEYBOARD_Z],
		scale: 0.007,
		floatSpeed: 0,
		floatIntensity: 0,
	},
	{
		path: "models_optimized/mousepad.glb",
		label: "pad",
		position: [PAD_X, PAD_Y, PAD_Z],
		scale: [PAD_SCALE * 0.9, PAD_SCALE, PAD_SCALE * 1.2],

		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PAD_ANGLE,
	},
	{
		path: "models_optimized/lowpoly_laptop_closed.glb",
		label: "Laptop",
		position: [LAPTOP_X, LAPTOP_Y, LAPTOP_Z],
		scale: 1.8,
		floatSpeed: 0,
		floatIntensity: 0,
	},
	{
		path: "models_optimized/the_serpent_-_tret030.glb",
		label: "DESK_LAMP",
		position: [DESK_LAMP_X, DESK_LAMP_Y, DESK_LAMP_Z],
		scale: DESK_LAMP_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: DESK_LAMP_ANGLE,
	},
	{
		path: "models_optimized/imac_magic_mouse.glb",
		label: "mouse",
		position: [MOUSE_X, MOUSE_Y, MOUSE_Z],
		scale: 1.5,
		floatSpeed: 0,
		floatIntensity: 0,
	},
	{
		path: "models_optimized/mug.glb",
		label: "Mug",
		position: [MUG_X, MUG_Y, MUG_Z],
		scale: MUG_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: MUG_ANGLE,
	},
	{
		path: "models_optimized/unhyun__straw_mat_a.glb",
		label: "COASTER",
		position: [COASTER_X, COASTER_Y, COASTER_Z],
		scale: COASTER_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: COASTER_ANGLE,
	},
	{
		path: "models_optimized/rug.glb",
		label: "rug office",
		position: [RUG_OFFICE_X, RUG_OFFICE_Y, RUG_OFFICE_Z],
		scale: [RUG_OFFICE_SCALE * 1.85, RUG_OFFICE_SCALE, RUG_OFFICE_SCALE * 2.5],
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: RUG_OFFICE_ANGLE,
	},
	{
		path: "models_optimized/welcome_text.glb",
		label: "TV_CODE",
		position: [TV_CODE_X, TV_CODE_Y, TV_CODE_Z],
		scale: TV_CODE_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: TV_CODE_ANGLE,
	},
	{
		path: "models_optimized/tv_with_a_wall_mount.glb",
		label: "TV",
		position: [TV_X, TV_Y, TV_Z],
		scale: TV_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: TV_ANGLE,
	},
	{
		path: "models_optimized/ipad_air4.glb",
		label: "tablet",
		position: [TABLET_X, TABLET_Y, TABLET_Z],
		scale: TABLET_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: TABLET_ANGLE,
	},

	{
		path: "models_optimized/bush_square.glb",
		label: "square",
		position: [PLANT_SQUARE_X, PLANT_SQUARE_Y, PLANT_SQUARE_Z],
		scale: [
			PLANT_SQUARE_SCALE * 1.5,
			PLANT_SQUARE_SCALE * 3,
			PLANT_SQUARE_SCALE * 3.5,
		],

		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_SQUARE_ANGLE,
	},
	{
		path: "models_optimized/bush_square.glb",
		label: "square",
		position: [PLANT_SQUARE_B_X, PLANT_SQUARE_Y, PLANT_SQUARE_B_Z],
		scale: [
			PLANT_SQUARE_SCALE * 1.5,
			PLANT_SQUARE_SCALE * 3,
			PLANT_SQUARE_SCALE * 3.5,
		],

		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_SQUARE_B_ANGLE,
	},
	{
		path: "models_optimized/bush_square.glb",
		label: "square",
		position: [PLANT_SQUARE_C_X, PLANT_SQUARE_Y, PLANT_SQUARE_C_Z],
		scale: [
			PLANT_SQUARE_SCALE * 1.5,
			PLANT_SQUARE_SCALE * 3,
			PLANT_SQUARE_SCALE * 5,
		],

		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_SQUARE_C_ANGLE,
	},

	{
		path: "models_optimized/green_creeper_plant.glb",
		label: "creeper",
		position: [
			PLANT_CREEPER_LEFT_X,
			PLANT_CREEPER_LEFT_Y,
			PLANT_CREEPER_LEFT_Z,
		],
		scale: [
			PLANT_CREEPER_LEFT_SCALE * 1.8,
			PLANT_CREEPER_LEFT_SCALE * 1.2,
			PLANT_CREEPER_LEFT_SCALE * 1.2,
		],

		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_CREEPER_LEFT_ANGLE,
	},

	{
		path: "models_optimized/green_creeper_plant.glb",
		label: "creeper",
		position: [
			PLANT_CREEPER_RIGHT_X,
			PLANT_CREEPER_RIGHT_Y,
			PLANT_CREEPER_RIGHT_Z,
		],
		scale: [
			PLANT_CREEPER_RIGHT_SCALE * 1.3,
			PLANT_CREEPER_RIGHT_SCALE * 1.7,
			PLANT_CREEPER_RIGHT_SCALE * 2,
		],

		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_CREEPER_RIGHT_ANGLE,
	},
	{
		path: "models_optimized/irvin_floor_lamp_natural_wood_and_white.glb",
		label: "FLOOR_LAMP",
		position: [FLOOR_LAMP_X, FLOOR_LAMP_Y, FLOOR_LAMP_Z],
		scale: FLOOR_LAMP_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: FLOOR_LAMP_ANGLE,
	},
	{
		path: "models_optimized/Untitled.glb",
		label: "Armchair",
		position: [ARMCHAIR_X, ARMCHAIR_Y, ARMCHAIR_Z],
		scale: ARMCHAIR_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: ARMCHAIR_ANGLE,
	},
	{
		path: "models_optimized/dylan_2_seater_sofa_mineral_blue.glb",
		label: "sofa",
		position: [SOFA_X, SOFA_Y, SOFA_Z],
		scale: [SOFA_SCALE * 1.3, SOFA_SCALE, SOFA_SCALE],
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: SOFA_ANGLE,
	},
	{
		path: "models_optimized/pillow_test.glb",
		label: "pillow",
		position: [PILLOW_X, PILLOW_Y, PILLOW_Z],
		scale: PILLOW_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PILLOW_ANGLE,
	},
	{
		path: "models_optimized/edelweiss_round_table_ash_and_white.glb",
		label: "coffee table",
		position: [COFFEE_TABLE_X, COFFEE_TABLE_Y, COFFEE_TABLE_Z],
		scale: [
			COFFEE_TABLE_SCALE * 1.1,
			COFFEE_TABLE_SCALE * 0.4,
			COFFEE_TABLE_SCALE * 1.3,
		],
		floatSpeed: 0,
		floatIntensity: 0,
	},

	{
		path: "models_optimized/rug.glb",
		label: "rug meeting",
		position: [RUG_MEETING_X, RUG_MEETING_Y, RUG_MEETING_Z],
		scale: [
			RUG_MEETING_SCALE * 1.8,
			RUG_MEETING_SCALE,
			RUG_MEETING_SCALE * 1.6,
		],
		floatSpeed: 0,
		floatIntensity: 0,
	},

	{
		path: "models_optimized/edelweiss_bar_table_ash_and_white.glb",
		label: "bar table",
		position: [BAR_TABLE_X, BAR_TABLE_Y, BAR_TABLE_Z],
		scale: [BAR_TABLE_SCALE * 1.2, BAR_TABLE_SCALE, BAR_TABLE_SCALE * 1.2],
		floatSpeed: 0,
		floatIntensity: 0,
	},
	{
		path: "models_optimized/set_of_2_edelweiss_bar_chairs_white.glb",
		label: "bar chair first",
		position: [BAR_CHAIR_FIRST_X, BAR_CHAIR_FIRST_Y, BAR_CHAIR_FIRST_Z],
		scale: BAR_CHAIR_FIRST_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: BAR_CHAIR_FIRST_ANGLE,
	},

	{
		path: "models_optimized/set_of_2_edelweiss_bar_chairs_white.glb",
		label: "bar chair second",
		position: [BAR_CHAIR_SECOND_X, BAR_CHAIR_SECOND_Y, BAR_CHAIR_SECOND_Z],
		scale: BAR_CHAIR_SECOND_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: BAR_CHAIR_SECOND_ANGLE,
	},
	{
		path: "models_optimized/shoe_cabinet.glb",
		label: "shelf",
		position: [SHELF_X, SHELF_Y, SHELF_Z],
		scale: [SHELF_SCALE * 2.5, SHELF_SCALE * 0.7, SHELF_SCALE * 1.2],
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: 0, //SHELF_ANGLE,
	},

	{
		path: "models_optimized/mud_material.glb",
		label: "mud",
		position: [MUD_X, MUD_Y, MUD_Z],
		scale: [MUD_SCALE * 3, MUD_SCALE, MUD_SCALE * 0.5],
		floatSpeed: 0,
		floatIntensity: 0,
	},
	{
		path: "models_optimized/wooden_fence.glb",
		label: "wooden_fence a",
		position: [WOODEN_FENCE_A_X, WOODEN_FENCE_Y, WOODEN_FENCE_Z],
		scale: [
			WOODEN_FENCE_SCALE * 2,
			WOODEN_FENCE_SCALE * 0.6,
			WOODEN_FENCE_SCALE * 6,
		],
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: WOODEN_FENCE_ANGLE,
	},
	{
		path: "models_optimized/wooden_fence.glb",
		label: "wooden_fence a",
		position: [WOODEN_FENCE_B_X, WOODEN_FENCE_Y, WOODEN_FENCE_Z],
		scale: [
			WOODEN_FENCE_SCALE * 2,
			WOODEN_FENCE_SCALE * 0.6,
			WOODEN_FENCE_SCALE * 6,
		],
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: WOODEN_FENCE_ANGLE,
	},
	{
		path: "models_optimized/wooden_fence.glb",
		label: "wooden_fence a",
		position: [WOODEN_FENCE_C_X, WOODEN_FENCE_Y, WOODEN_FENCE_Z],
		scale: [
			WOODEN_FENCE_SCALE * 2,
			WOODEN_FENCE_SCALE * 0.6,
			WOODEN_FENCE_SCALE * 6,
		],
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: WOODEN_FENCE_ANGLE,
	},
	{
		path: "models_optimized/wooden_fence.glb",
		label: "wooden_fence a",
		position: [WOODEN_FENCE_D_X, WOODEN_FENCE_Y, WOODEN_FENCE_Z],
		scale: [
			WOODEN_FENCE_SCALE * 2,
			WOODEN_FENCE_SCALE * 0.6,
			WOODEN_FENCE_SCALE * 6,
		],
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: WOODEN_FENCE_ANGLE,
	},
	{
		path: "models_optimized/wooden_fence.glb",
		label: "wooden_fence a",
		position: [WOODEN_FENCE_E_X, WOODEN_FENCE_Y, WOODEN_FENCE_Z],
		scale: [
			WOODEN_FENCE_SCALE * 2,
			WOODEN_FENCE_SCALE * 0.6,
			WOODEN_FENCE_SCALE * 6,
		],
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: WOODEN_FENCE_ANGLE,
	},

	{
		path: "models_optimized/realistic_hd_chinese_jungle_geranium_310.glb",
		label: "jungle geranium",
		position: [PLANT_GERANIUM_A_X, PLANT_GERANIUM_Y, PLANT_GERANIUM_A_Z],
		scale: PLANT_GERANIUM_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_GERANIUM_A_ANGLE,
	},
	{
		path: "models_optimized/realistic_hd_chinese_jungle_geranium_310.glb",
		label: "jungle geranium",
		position: [PLANT_GERANIUM_B_X, PLANT_GERANIUM_Y, PLANT_GERANIUM_B_Z],
		scale: PLANT_GERANIUM_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_GERANIUM_B_ANGLE,
	},
	{
		path: "models_optimized/realistic_hd_chinese_jungle_geranium_310.glb",
		label: "jungle geranium",
		position: [PLANT_GERANIUM_C_X, PLANT_GERANIUM_Y, PLANT_GERANIUM_C_Z],
		scale: PLANT_GERANIUM_C_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_GERANIUM_C_ANGLE,
	},

	{
		path: "models_optimized/realistic_hd_chinese_jungle_geranium_310.glb",
		label: "jungle geranium",
		position: [PLANT_GERANIUM_D_X, PLANT_GERANIUM_Y, PLANT_GERANIUM_D_Z],
		scale: PLANT_GERANIUM_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_GERANIUM_D_ANGLE,
	},
	{
		path: "models_optimized/realistic_hd_chinese_jungle_geranium_310.glb",
		label: "jungle geranium",
		position: [PLANT_GERANIUM_E_X, PLANT_GERANIUM_Y, PLANT_GERANIUM_E_Z],
		scale: PLANT_GERANIUM_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_GERANIUM_E_ANGLE,
	},

	{
		path: "models_optimized/realistic_hd_windmill_palm_1625.glb",
		label: "jungle PALM",
		position: [PLANT_PALM_A_X, PLANT_PALM_Y, PLANT_PALM_A_Z],
		scale: PLANT_PALM_A_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_PALM_A_ANGLE,
	},
	{
		path: "models_optimized/realistic_hd_windmill_palm_1625.glb",
		label: "jungle PALM",
		position: [PLANT_PALM_B_X, PLANT_PALM_Y, PLANT_PALM_B_Z],
		scale: PLANT_PALM_B_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_PALM_B_ANGLE,
	},
	{
		path: "models_optimized/realistic_hd_large-leaved_lupine_318.glb",
		label: "jungle LUPINE",
		position: [PLANT_LUPINE_A_X, PLANT_LUPINE_Y, PLANT_LUPINE_A_Z],
		scale: PLANT_LUPINE_A_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_LUPINE_A_ANGLE,
	},
	{
		path: "models_optimized/realistic_hd_large-leaved_lupine_318.glb",
		label: "jungle LUPINE",
		position: [PLANT_LUPINE_B_X, PLANT_LUPINE_Y, PLANT_LUPINE_B_Z],
		scale: [
			PLANT_LUPINE_B_SCALE * 1.2,
			PLANT_LUPINE_B_SCALE * 0.8,
			PLANT_LUPINE_B_SCALE * 1.2,
		],
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_LUPINE_B_ANGLE,
	},
	{
		path: "models_optimized/realistic_hd_large-leaved_lupine_318.glb",
		label: "jungle LUPINE",
		position: [PLANT_LUPINE_C_X, PLANT_LUPINE_Y, PLANT_LUPINE_C_Z],
		scale: [
			PLANT_LUPINE_C_SCALE * 1.2,
			PLANT_LUPINE_C_SCALE * 0.8,
			PLANT_LUPINE_C_SCALE * 1.2,
		],
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_LUPINE_C_ANGLE,
	},
	{
		path: "models_optimized/realistic_hd_large-leaved_lupine_318.glb",
		label: "jungle LUPINE",
		position: [PLANT_LUPINE_D_X, PLANT_LUPINE_Y, PLANT_LUPINE_D_Z],
		scale: [
			PLANT_LUPINE_D_SCALE * 1.2,
			PLANT_LUPINE_D_SCALE * 0.8,
			PLANT_LUPINE_D_SCALE * 1.2,
		],
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_LUPINE_D_ANGLE,
	},

	{
		path: "models_optimized/dwarf_snowflake_mock_orange_flowers_spring.glb",
		label: "jungle SNOWFLAKE",
		position: [PLANT_SNOWFLAKE_A_X, PLANT_SNOWFLAKE_Y, PLANT_SNOWFLAKE_A_Z],
		scale: [
			PLANT_SNOWFLAKE_A_SCALE * 1.4,
			PLANT_SNOWFLAKE_A_SCALE * 0.9,
			PLANT_SNOWFLAKE_A_SCALE * 1.4,
		],
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_SNOWFLAKE_A_ANGLE,
	},
	{
		path: "models_optimized/dwarf_snowflake_mock_orange_flowers_spring.glb",
		label: "jungle SNOWFLAKE",
		position: [PLANT_SNOWFLAKE_B_X, PLANT_SNOWFLAKE_Y, PLANT_SNOWFLAKE_B_Z],
		scale: [
			PLANT_SNOWFLAKE_B_SCALE * 1.4,
			PLANT_SNOWFLAKE_B_SCALE * 0.7,
			PLANT_SNOWFLAKE_B_SCALE * 1.4,
		],
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_SNOWFLAKE_B_ANGLE,
	},

	{
		path: "models_optimized/dwarf_snowflake_mock_orange_flowers_spring.glb",
		label: "jungle SNOWFLAKE",
		position: [PLANT_SNOWFLAKE_C_X, PLANT_SNOWFLAKE_Y, PLANT_SNOWFLAKE_C_Z],
		scale: [
			PLANT_SNOWFLAKE_C_SCALE * 1.4,
			PLANT_SNOWFLAKE_C_SCALE * 0.9,
			PLANT_SNOWFLAKE_C_SCALE * 1.4,
		],
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_SNOWFLAKE_C_ANGLE,
	},
	{
		path: "models_optimized/dwarf_snowflake_mock_orange_flowers_spring.glb",
		label: "jungle SNOWFLAKE",
		position: [PLANT_SNOWFLAKE_D_X, PLANT_SNOWFLAKE_Y, PLANT_SNOWFLAKE_D_Z],
		scale: [
			PLANT_SNOWFLAKE_D_SCALE * 1.4,
			PLANT_SNOWFLAKE_D_SCALE * 0.9,
			PLANT_SNOWFLAKE_D_SCALE * 1.4,
		],
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_SNOWFLAKE_D_ANGLE,
	},

	{
		path: "models_optimized/croton_leaf_plants.glb",
		label: "jungle CROTON",
		position: [PLANT_CROTON_A_X, PLANT_CROTON_Y, PLANT_CROTON_A_Z],
		scale: PLANT_CROTON_A_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_CROTON_A_ANGLE,
	},
	{
		path: "models_optimized/croton_leaf_plants.glb",
		label: "jungle CROTON",
		position: [PLANT_CROTON_B_X, PLANT_CROTON_Y, PLANT_CROTON_B_Z],
		scale: PLANT_CROTON_B_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_CROTON_B_ANGLE,
	},
	{
		path: "models_optimized/croton_leaf_plants.glb",
		label: "jungle CROTON",
		position: [PLANT_CROTON_C_X, PLANT_CROTON_Y, PLANT_CROTON_C_Z],
		scale: PLANT_CROTON_C_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_CROTON_C_ANGLE,
	},
	{
		path: "models_optimized/croton_leaf_plants.glb",
		label: "jungle CROTON",
		position: [PLANT_CROTON_D_X, PLANT_CROTON_Y, PLANT_CROTON_D_Z],
		scale: PLANT_CROTON_D_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_CROTON_D_ANGLE,
	},
	{
		path: "models_optimized/wisteria_sinensis005.glb",
		label: "jungle SINENSIS",
		position: [PLANT_SINENSIS_A_X, PLANT_SINENSIS_Y, PLANT_SINENSIS_A_Z],
		scale: [
			PLANT_SINENSIS_A_SCALE,
			PLANT_SINENSIS_A_SCALE * 0.8,
			PLANT_SINENSIS_A_SCALE,
		],
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_SINENSIS_A_ANGLE,
	},
	{
		path: "models_optimized/wisteria_sinensis005.glb",
		label: "jungle SINENSIS",
		position: [PLANT_SINENSIS_B_X, PLANT_SINENSIS_Y, PLANT_SINENSIS_B_Z],
		scale: [
			PLANT_SINENSIS_B_SCALE,
			PLANT_SINENSIS_B_SCALE * 0.9,
			PLANT_SINENSIS_B_SCALE,
		],

		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_SINENSIS_B_ANGLE,
	},

	{
		path: "models_optimized/realistic_hd_chinese_jungle_geranium_710.glb",
		label: "jungle BUSH",
		position: [PLANT_BUSH_A_X, PLANT_BUSH_Y, PLANT_BUSH_A_Z],
		scale: [
			PLANT_BUSH_A_SCALE * 1.2,
			PLANT_BUSH_A_SCALE,
			PLANT_BUSH_A_SCALE * 1.3,
		],
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_BUSH_A_ANGLE,
	},
	{
		path: "models_optimized/realistic_hd_chinese_jungle_geranium_710.glb",
		label: "jungle BUSH",
		position: [PLANT_BUSH_B_X, PLANT_BUSH_Y, PLANT_BUSH_B_Z],
		scale: [
			PLANT_BUSH_B_SCALE * 1.1,
			PLANT_BUSH_B_SCALE,
			PLANT_BUSH_B_SCALE * 1.1,
		],
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_BUSH_B_ANGLE,
	},
	{
		path: "models_optimized/realistic_hd_chinese_jungle_geranium_710.glb",
		label: "jungle BUSH",
		position: [PLANT_BUSH_C_X, PLANT_BUSH_Y, PLANT_BUSH_C_Z],
		scale: [
			PLANT_BUSH_C_SCALE * 1.2,
			PLANT_BUSH_C_SCALE,
			PLANT_BUSH_C_SCALE * 1.3,
		],
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_BUSH_C_ANGLE,
	},
	{
		path: "models_optimized/realistic_hd_chinese_jungle_geranium_710.glb",
		label: "jungle BUSH",
		position: [PLANT_BUSH_D_X, PLANT_BUSH_Y, PLANT_BUSH_D_Z],
		scale: [
			PLANT_BUSH_D_SCALE * 1.2,
			PLANT_BUSH_D_SCALE,
			PLANT_BUSH_D_SCALE * 1.3,
		],
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: PLANT_BUSH_D_ANGLE,
	},
	{
		path: "models_optimized/free_pothos_potted_plant_-_money_plant.glb",
		label: "plant_money",
		position: [PLANT_MONEY_X, PLANT_MONEY_Y, PLANT_MONEY_Z],
		scale: PLANT_MONEY_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
	},
	{
		path: "models_optimized/jenson_sideboard_solid_oak.glb",
		label: "bookcase",
		position: [BOOKCASE_X, BOOKCASE_Y, BOOKCASE_Z],
		scale: [BOOKCASE_SCALE * 2.4, BOOKCASE_SCALE, BOOKCASE_SCALE * 1.5],
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: BOOKCASE_ANGLE,
	},

	{
		path: "models_optimized/fruit_basket.glb",
		label: "ORANGE_FLOWERS",
		position: [FRUITS_X, FRUITS_Y, FRUITS_Z],
		scale: FRUITS_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
	},
	{
		path: "models_optimized/teapot.glb",
		label: "ORANGE_FLOWERS",
		position: [TEA_X, TEA_Y, TEA_Z],
		scale: TEA_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: TEA_ANGLE,
	},

	{
		path: "models_optimized/nespresso_machine_2.glb",
		label: "ORANGE_FLOWERS",
		position: [COFFEE_X, COFFEE_Y, COFFEE_Z],
		scale: COFFEE_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
	},
];

// Draco decoder needed for the optimized GLBs (geometry compressed with Draco).
// Google CDN ships wasm decoder; drei reads this path via setDecoderPath.
useGLTF.setDecoderPath(
	"https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
);

MODEL_CONFIG.forEach(({ path }) => {
	const model = import.meta.env.BASE_URL + path;
	useGLTF.preload(model);
});

// Preload the code GLB used on monitors (not in MODEL_CONFIG — rendered via CodeOnMonitors)
useGLTF.preload(
	import.meta.env.BASE_URL +
		"models_optimized/alexandra_cardenas_livecoding_d5.glb"
);

// ─── Individual model loader ──────────────────────────────────────────────────
function Model({
	path,
	position,
	scale,
	floatSpeed,
	floatIntensity,
	rotationY = 0,
}: Omit<ModelConfig, "label">) {
	const url = import.meta.env.BASE_URL + path;
	const skipShadows = NO_SHADOW_PATHS.has(path);

	const isEmissiveText = path === "models_optimized/welcome_text.glb";

	const { scene } = useGLTF(url) as GLTF & { scene: THREE.Group };
	const cloned = useMemo(() => {
		const c = scene.clone(true);
		c.traverse((obj) => {
			const mesh = obj as THREE.Mesh;
			if ((mesh as THREE.Mesh).isMesh) {
				mesh.castShadow = !skipShadows;
				mesh.receiveShadow = !skipShadows;
				// Crisp textures on distant/large surfaces — kills pixelation.
				const mat = mesh.material as
					| THREE.MeshStandardMaterial
					| THREE.MeshStandardMaterial[];
				const mats = Array.isArray(mat) ? mat : [mat];
				mats.forEach((m) => {
					if (!m) return;
					// TV text glows as if the screen is on
				if (isEmissiveText) {
					m.emissive = new THREE.Color("#a8d4ff");
					m.emissiveIntensity = 3.5;
					m.toneMapped = false;
				}
					const maps: (THREE.Texture | null | undefined)[] = [
						m.map,
						m.normalMap,
						m.roughnessMap,
						m.metalnessMap,
						m.aoMap,
						m.emissiveMap,
					];
					maps.forEach((t) => {
						if (!t) return;
						t.anisotropy = 16;
						t.minFilter = THREE.LinearMipmapLinearFilter;
						t.magFilter = THREE.LinearFilter;
						t.generateMipmaps = true;
						t.needsUpdate = true;
					});
				});
			}
		});
		return c;
	}, [scene]);

	return (
		<Float
			speed={floatSpeed}
			floatIntensity={floatIntensity}
			rotationIntensity={floatSpeed > 0 ? 0.05 : 0}
		>
			<primitive
				object={cloned}
				position={position}
				scale={scale}
				rotation-y={rotationY}
			/>
		</Float>
	);
}

// ─── Code split across 3 monitors ────────────────────────────────────────────
// Loads the livecoding GLB once and renders 3 clipped copies — one per monitor.
// Each copy shows a vertical third of the code mesh using clipping planes.
function CodeOnMonitors() {
	const url =
		import.meta.env.BASE_URL +
		"models_optimized/alexandra_cardenas_livecoding_d5.glb";
	const { scene } = useGLTF(url) as GLTF & { scene: THREE.Group };

	// Compute bounding box once to determine vertical thirds.
	const { sections } = useMemo(() => {
		const box = new THREE.Box3().setFromObject(scene);
		const minY = box.min.y;
		const maxY = box.max.y;
		const third = (maxY - minY) / 3;

		// Each section: [clipMin, clipMax] in local Y
		return {
			sections: [
				{ clipMin: minY + third * 2, clipMax: maxY }, // top third
				{ clipMin: minY + third, clipMax: minY + third * 2 }, // middle third
				{ clipMin: minY, clipMax: minY + third }, // bottom third
			],
		};
	}, [scene]);

	// Monitor positions + rotations for A, B, C
	const monitors: {
		pos: [number, number, number];
		rotY: number;
		section: (typeof sections)[number];
	}[] = useMemo(
		() => [
			{
				pos: [MONITOR_A_X + 0.05, MONITOR_A_Y + 0.55, MONITOR_A_Z - 0.02],
				rotY: MONITOR_A_ANGLE,
				section: sections[0],
			},
			{
				pos: [MONITOR_B_X + 0.05, MONITOR_B_Y + 0.55, MONITOR_B_Z - 0.02],
				rotY: MONITOR_B_ANGLE,
				section: sections[1],
			},
			{
				pos: [MONITOR_C_X + 0.05, MONITOR_C_Y + 0.55, MONITOR_C_Z - 0.02],
				rotY: MONITOR_C_ANGLE,
				section: sections[2],
			},
		],
		[sections]
	);

	return (
		<>
			{monitors.map((m, i) => (
				<CodeSection
					key={i}
					scene={scene}
					position={m.pos}
					rotationY={m.rotY}
					clipMin={m.section.clipMin}
					clipMax={m.section.clipMax}
				/>
			))}
		</>
	);
}

function CodeSection({
	scene,
	position,
	rotationY,
	clipMin,
	clipMax,
}: {
	scene: THREE.Group;
	position: [number, number, number];
	rotationY: number;
	clipMin: number;
	clipMax: number;
}) {
	const cloned = useMemo(() => {
		const c = scene.clone(true);
		// Two clipping planes: cut below clipMin, cut above clipMax
		const planeBottom = new THREE.Plane(new THREE.Vector3(0, 1, 0), -clipMin);
		const planeTop = new THREE.Plane(new THREE.Vector3(0, -1, 0), clipMax);
		const planes = [planeBottom, planeTop];

		c.traverse((obj) => {
			const mesh = obj as THREE.Mesh;
			if (mesh.isMesh) {
				// Clone material to avoid shared clipping state
				const mat = (mesh.material as THREE.Material).clone();
				mat.clippingPlanes = planes;
				mat.clipShadows = true;
				mesh.material = mat;
				mesh.castShadow = true;
				mesh.receiveShadow = true;
			}
		});
		return c;
	}, [scene, clipMin, clipMax]);

	return (
		<primitive
			object={cloned}
			position={position}
			scale={0.45}
			rotation-y={rotationY}
		/>
	);
}

// ─── Full-screen loader overlay ───────────────────────────────────────────────
// Fades out only when all GLBs are ready, so nothing pops in.
function LoaderOverlay() {
	const { active, progress } = useProgress();
	const [hidden, setHidden] = useState(false);

	useEffect(() => {
		if (!active && progress >= 100) {
			const t = setTimeout(() => setHidden(true), 450);
			return () => clearTimeout(t);
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

// ─── Lighting ─────────────────────────────────────────────────────────────────
// Post-rain summer atmosphere — bright cloudy sky, warm sun aimed at pergola,
// two soft warm interior lamps. Every light that matters casts shadows.
function PostRainSummerLighting() {
	// Directional sun needs an explicit target object so it behaves like a
	// natural spotlight pointing at the pergola area.
	const sunTarget = useMemo(() => {
		const o = new THREE.Object3D();
		o.position.set(PERGOLA_X, PERGOLA_Y + 8, PERGOLA_Z);
		return o;
	}, []);

	return (
		<>
			{/* Humid post-rain ambient — warm, brighter to restore color */}
			<ambientLight color='#fff1d6' intensity={0.75} />

			{/* Bright cloudy sky + warm earth bounce */}
			<hemisphereLight args={["#fff4dc", "#b89878", 1.6]} />

			{/* Warm sun — behind far side of mountain, aimed down at pergola.
			    Acts like a natural spotlight via the target object. */}
			<primitive object={sunTarget} />
			<directionalLight
				color='#ffe3b8'
				intensity={4.5}
				position={[PERGOLA_X - 45, PERGOLA_Y + 55, PERGOLA_Z - 40]}
				target={sunTarget}
				castShadow
				shadow-mapSize-width={1024}
				shadow-mapSize-height={1024}
				shadow-bias={-0.0005}
				shadow-normalBias={0.02}
				shadow-camera-near={0.5}
				shadow-camera-far={80}
				shadow-camera-left={-22}
				shadow-camera-right={22}
				shadow-camera-top={22}
				shadow-camera-bottom={-22}
			/>

			{/* Soft opposite fill — lifts crushed shadows on turquoise chairs */}
			<directionalLight
				color='#dfeaff'
				intensity={0.9}
				position={[PERGOLA_X + 30, PERGOLA_Y + 40, PERGOLA_Z + 30]}
			/>

			{/* Desk lamp — warm, low. No shadow (point-light shadow = 6 cube passes). */}
			<pointLight
				color='#ffb870'
				intensity={6}
				distance={4}
				decay={2}
				position={[DESK_LAMP_X, DESK_LAMP_Y + 0.2, DESK_LAMP_Z]}
			/>

		{/* Coffee-table / floor lamp — warm, low. No shadow for same reason. */}
		<pointLight
			color='#ffb870'
			intensity={7}
			distance={5}
			decay={2}
			position={[FLOOR_LAMP_X, FLOOR_LAMP_Y + 2.2, FLOOR_LAMP_Z]}
		/>

	</>
	);
}

// ─── Camera tracker ──────────────────────────────────────────────────────────
// Logs camera position + OrbitControls target to devtools on every change.
function CameraTracker({
	controlsRef,
}: {
	controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
	const { camera } = useThree();
	const lastPos = useRef(new THREE.Vector3());
	const lastTarget = useRef(new THREE.Vector3());

	useFrame(() => {
		const pos = camera.position;
		const target = controlsRef.current?.target ?? new THREE.Vector3();

		const posChanged =
			Math.abs(pos.x - lastPos.current.x) > 0.01 ||
			Math.abs(pos.y - lastPos.current.y) > 0.01 ||
			Math.abs(pos.z - lastPos.current.z) > 0.01;

		const targetChanged =
			Math.abs(target.x - lastTarget.current.x) > 0.01 ||
			Math.abs(target.y - lastTarget.current.y) > 0.01 ||
			Math.abs(target.z - lastTarget.current.z) > 0.01;

		if (posChanged || targetChanged) {
			console.log("%c[Camera]", "color:#dedede;font-weight:bold", {
				position: {
					x: +pos.x.toFixed(2),
					y: +pos.y.toFixed(2),
					z: +pos.z.toFixed(2),
				},
				target: {
					x: +target.x.toFixed(2),
					y: +target.y.toFixed(2),
					z: +target.z.toFixed(2),
				},
			});
			lastPos.current.copy(pos);
			lastTarget.current.copy(target);
		}
	});

	return null;
}

// ─── Shader pre-compiler ─────────────────────────────────────────────────────
// Walks every camera preset once after load and calls gl.compile() so WebGL
// compiles all shader programs up-front. Prevents the stutter when switching
// to a preset for the first time (e.g. workstation → garden) since the dense
// vegetation enters the frustum and would otherwise JIT-compile mid-transition.
function ShaderWarmup() {
	const { gl, scene, camera } = useThree();
	const { active, progress } = useProgress();
	const warmedRef = useRef(false);

	useEffect(() => {
		if (warmedRef.current) return;
		if (active || progress < 100) return;
		warmedRef.current = true;

		const cam = camera as THREE.PerspectiveCamera;
		const originalPos = cam.position.clone();
		const originalQuat = cam.quaternion.clone();

		// Compile once at each preset pose so every material/shadow combo
		// this scene will ever use is hot in the GL driver cache.
		(Object.keys(CAMERA_PRESETS) as PresetKey[]).forEach((key) => {
			const p = CAMERA_PRESETS[key];
			cam.position.set(...p.position);
			cam.lookAt(...p.target);
			cam.updateMatrixWorld(true);
			gl.compile(scene, cam);
		});

		// Restore initial camera pose.
		cam.position.copy(originalPos);
		cam.quaternion.copy(originalQuat);
		cam.updateMatrixWorld(true);

		// Force one shadow refresh now that shaders are compiled; BakeShadows
		// will then freeze autoUpdate.
		gl.shadowMap.needsUpdate = true;
	}, [active, progress, gl, scene, camera]);

	return null;
}

// ─── Camera presets ──────────────────────────────────────────────────────────
type PresetKey = "workstation" | "meeting" | "balcony" | "garden";

interface CameraPreset {
	position: [number, number, number];
	target: [number, number, number];
}

const CAMERA_PRESETS: Record<PresetKey, CameraPreset> = {
	workstation: {
		// Pulled back and elevated — desk/monitors in foreground, mountain landscape visible behind.
		position: [DESK_X + 7, DESK_Y + 4.5, DESK_Z + 7],
		target: [DESK_X - 2, DESK_Y + 0.2, DESK_Z - 2],
	},
	meeting: {
		// Close/intimate: sofa + coffee-table + TV + floor lamp in frame.
		position: [COFFEE_TABLE_X + 3, COFFEE_TABLE_Y + 1.8, COFFEE_TABLE_Z + 3.2],
		target: [COFFEE_TABLE_X - 1.2, COFFEE_TABLE_Y + 0.8, COFFEE_TABLE_Z],
	},
	balcony: {
		position: [-3.1, -33.43, -10.73],
		target: [0, -33.8, -15.6],
	},
	garden: {
		// Wide outdoor framing over the mud bed, plants, fence and surrounding
		// environment — calm, leafy, open.
		position: [MUD_X + 7, MUD_Y + 4.5, MUD_Z + 7],
		target: [MUD_X, MUD_Y + 0.8, MUD_Z - 1.2],
	},
};

const INITIAL_PRESET: PresetKey = "workstation";

// ─── Camera rig ──────────────────────────────────────────────────────────────
// Smoothly lerps camera position + OrbitControls target toward active preset.
// Disables user input + damping during transition to avoid fighting the lerp.
function CameraRig({
	activePreset,
	controlsRef,
}: {
	activePreset: PresetKey;
	controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
	const { camera } = useThree();
	const desiredPos = useRef(new THREE.Vector3());
	const desiredTarget = useRef(new THREE.Vector3());
	const animating = useRef(false);

	// On preset change → set new desired pose and start animating.
	useEffect(() => {
		const p = CAMERA_PRESETS[activePreset];
		desiredPos.current.set(...p.position);
		desiredTarget.current.set(...p.target);
		animating.current = true;
		if (controlsRef.current) {
			controlsRef.current.enabled = false;
		}
	}, [activePreset, controlsRef]);

	// Initial snap (before first user interaction).
	useEffect(() => {
		const p = CAMERA_PRESETS[INITIAL_PRESET];
		camera.position.set(...p.position);
		if (controlsRef.current) {
			controlsRef.current.target.set(...p.target);
			controlsRef.current.update();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useFrame(() => {
		if (!animating.current) return;
		const controls = controlsRef.current;
		camera.position.lerp(desiredPos.current, 0.08);
		if (controls) {
			controls.target.lerp(desiredTarget.current, 0.08);
			controls.update();
		}
		const posDone = camera.position.distanceTo(desiredPos.current) < 0.02;
		const tgtDone = controls
			? controls.target.distanceTo(desiredTarget.current) < 0.02
			: true;
		if (posDone && tgtDone) {
			camera.position.copy(desiredPos.current);
			if (controls) {
				controls.target.copy(desiredTarget.current);
				controls.enabled = true;
				controls.update();
			}
			animating.current = false;
		}
	});

	return null;
}

// ─── In-scene 3D button ──────────────────────────────────────────────────────
// Small glowing disc with floating HTML label; acts as click affordance.
function SceneButton3D({
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
		</group>
	);
}

// ─── Monitor popup (DOM overlay) ─────────────────────────────────────────────
function MonitorPopup({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	if (!open) return null;
	return (
		<div
			onClick={onClose}
			style={{
				position: "fixed",
				inset: 0,
				background: "rgba(10,8,6,0.55)",
				backdropFilter: "blur(6px)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 20,
				fontFamily: "system-ui, sans-serif",
			}}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				style={{
					background: "#fffaf0",
					color: "#3a2a10",
					padding: "28px 32px",
					borderRadius: 14,
					maxWidth: 420,
					boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
					border: "1px solid #e6d5a8",
				}}
			>
				<h2 style={{ margin: "0 0 10px 0", fontSize: 20 }}>Monitor</h2>
				<p style={{ margin: "0 0 18px 0", fontSize: 14, lineHeight: 1.5 }}>
					Popup opened. Placeholder interaction triggered from the middle
					monitor.
				</p>
				<button
					onClick={onClose}
					style={{
						background: "#c68a3a",
						color: "#fff",
						border: "none",
						padding: "8px 18px",
						borderRadius: 8,
						fontSize: 14,
						fontWeight: 600,
						cursor: "pointer",
					}}
				>
					Close
				</button>
			</div>
		</div>
	);
}

// ─── Intro animation ─────────────────────────────────────────────────────────
// Cinematic fly-through: smooth Catmull-Rom orbit around mountain peak →
// transition to meeting area → pause → fly to workspace (landscape view).
// ~12 seconds total.

// Orbit control points for CatmullRomCurve3 (camera sweeps around peak).
const ORBIT_POINTS: [number, number, number][] = [
	[-32.5, -18.37, -0.07],
	[-25, -20, 14],
	[-14, -21.5, 24],
	[4, -20, 30],
	[16.37, -19.86, 28.95],
];
// Target stays fixed on mountain/pergola area during orbit.
const ORBIT_TARGET: [number, number, number] = [7.35, -34.2, -12.3];

// Timing phases (seconds)
const ORBIT_DURATION = 6; // smooth spline orbit
const ORBIT_TO_MEETING = 2; // transition from orbit end → meeting
const MEETING_DWELL = 1.5; // pause at meeting
const MEETING_TO_WORKSPACE = 2.5; // transition from meeting → workspace
const INTRO_DURATION =
	ORBIT_DURATION + ORBIT_TO_MEETING + MEETING_DWELL + MEETING_TO_WORKSPACE;

function easeInOutCubic(t: number) {
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function IntroAnimation({
	controlsRef,
	onComplete,
}: {
	controlsRef: React.RefObject<OrbitControlsImpl | null>;
	onComplete: () => void;
}) {
	const { camera } = useThree();
	const { active, progress } = useProgress();
	const startedRef = useRef(false);
	const elapsedRef = useRef(0);
	const doneRef = useRef(false);

	// Pre-build the Catmull-Rom spline for the orbit phase (once).
	const orbitCurve = useMemo(() => {
		const pts = ORBIT_POINTS.map((p) => new THREE.Vector3(...p));
		return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);
	}, []);

	// Only start once loading finishes
	useEffect(() => {
		if (!active && progress >= 100 && !startedRef.current) {
			startedRef.current = true;
			if (controlsRef.current) controlsRef.current.enabled = false;
			// Set camera to first point on spline
			const startPos = orbitCurve.getPointAt(0);
			camera.position.copy(startPos);
			camera.lookAt(...ORBIT_TARGET);
		}
	}, [active, progress, camera, controlsRef, orbitCurve]);

	useFrame((_, delta) => {
		if (!startedRef.current || doneRef.current) return;

		elapsedRef.current += delta;
		const elapsed = Math.min(elapsedRef.current, INTRO_DURATION);

		let pos: THREE.Vector3;
		let tgt: THREE.Vector3;

		if (elapsed <= ORBIT_DURATION) {
			// ── Phase 1: Catmull-Rom orbit around mountain peak ──
			const t = easeInOutCubic(elapsed / ORBIT_DURATION);
			pos = orbitCurve.getPointAt(t);
			tgt = new THREE.Vector3(...ORBIT_TARGET);
		} else if (elapsed <= ORBIT_DURATION + ORBIT_TO_MEETING) {
			// ── Phase 2: Transition from orbit end → meeting ──
			const segElapsed = elapsed - ORBIT_DURATION;
			const t = easeInOutCubic(segElapsed / ORBIT_TO_MEETING);
			const fromPos = orbitCurve.getPointAt(1);
			const toPos = new THREE.Vector3(...CAMERA_PRESETS.meeting.position);
			pos = new THREE.Vector3().lerpVectors(fromPos, toPos, t);
			const fromTgt = new THREE.Vector3(...ORBIT_TARGET);
			const toTgt = new THREE.Vector3(...CAMERA_PRESETS.meeting.target);
			tgt = new THREE.Vector3().lerpVectors(fromTgt, toTgt, t);
		} else if (elapsed <= ORBIT_DURATION + ORBIT_TO_MEETING + MEETING_DWELL) {
			// ── Phase 3: Dwell at meeting ──
			pos = new THREE.Vector3(...CAMERA_PRESETS.meeting.position);
			tgt = new THREE.Vector3(...CAMERA_PRESETS.meeting.target);
		} else {
			// ── Phase 4: Meeting → workspace (landscape view) ──
			const segElapsed =
				elapsed - ORBIT_DURATION - ORBIT_TO_MEETING - MEETING_DWELL;
			const t = easeInOutCubic(segElapsed / MEETING_TO_WORKSPACE);
			const fromPos = new THREE.Vector3(...CAMERA_PRESETS.meeting.position);
			const toPos = new THREE.Vector3(...CAMERA_PRESETS.workstation.position);
			pos = new THREE.Vector3().lerpVectors(fromPos, toPos, t);
			const fromTgt = new THREE.Vector3(...CAMERA_PRESETS.meeting.target);
			const toTgt = new THREE.Vector3(...CAMERA_PRESETS.workstation.target);
			tgt = new THREE.Vector3().lerpVectors(fromTgt, toTgt, t);
		}

		camera.position.copy(pos);
		if (controlsRef.current) {
			controlsRef.current.target.copy(tgt);
			controlsRef.current.update();
		} else {
			camera.lookAt(tgt);
		}

		if (elapsed >= INTRO_DURATION) {
			doneRef.current = true;
			if (controlsRef.current) controlsRef.current.enabled = true;
			onComplete();
		}
	});

	return null;
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene({
	activePreset,
	setActivePreset,
	onOpenPopup,
	introComplete,
	onIntroComplete,
}: {
	activePreset: PresetKey;
	setActivePreset: (p: PresetKey) => void;
	onOpenPopup: () => void;
	introComplete: boolean;
	onIntroComplete: () => void;
}) {
	const controlsRef = useRef<OrbitControlsImpl>(null);

	return (
		<>
			<PostRainSummerLighting />
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
				{MODEL_CONFIG.map((config) => (
					<Model
						key={config.position.join(",")}
						path={config.path}
						position={config.position}
						scale={config.scale}
						floatSpeed={config.floatSpeed}
						floatIntensity={config.floatIntensity}
						rotationY={config.rotationY}
					/>
				))}

				{/* Button — Monitor popup trigger, placed near keyboard with hotspot cue */}
				<SceneButton3D
					position={[KEYBOARD_X, KEYBOARD_Y + 0.35, KEYBOARD_Z]}
					color='#e84a6a'
					label='Open'
					onClick={() => {
						console.log("Popup opened");
						onOpenPopup();
					}}
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

// ─── World (root export) ──────────────────────────────────────────────────────
// Camera: pulled back and slightly low so the mountain fills the frame,
// with the glass terrace + desk visible at the summit.
export default function World() {
	const [activePreset, setActivePreset] = useState<PresetKey>(INITIAL_PRESET);
	const [popupOpen, setPopupOpen] = useState(false);
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
				<Scene
					activePreset={activePreset}
					setActivePreset={setActivePreset}
					onOpenPopup={() => setPopupOpen(true)}
					introComplete={introComplete}
					onIntroComplete={() => setIntroComplete(true)}
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
				{(
					[
						{ key: "workstation", label: "Workstation", color: "#e88a3a" },
						{ key: "meeting", label: "Meeting", color: "#6aa5d8" },
						{ key: "balcony", label: "Balcony", color: "#7fc27f" },
						{ key: "garden", label: "Garden", color: "#8dbf6a" },
					] as { key: PresetKey; label: string; color: string }[]
				).map((b) => (
					<button
						key={b.key}
						onClick={() => setActivePreset(b.key)}
						style={{
							background:
								activePreset === b.key ? b.color : "rgba(30,20,10,0.75)",
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
						{b.label}
					</button>
				))}
			</div>

			<MonitorPopup open={popupOpen} onClose={() => setPopupOpen(false)} />
			<LoaderOverlay />
		</div>
	);
}
