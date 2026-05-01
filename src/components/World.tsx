import { Suspense, useMemo, useRef, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import {
	OrbitControls,
	useGLTF,
	Float,
	BakeShadows,
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

const MONITOR_CODE_X = MONITOR_C_X + 2;
const MONITOR_CODE_Y = MONITOR_C_Y + 1;
const MONITOR_CODE_Z = MONITOR_C_Z + 1;
const MONITOR_CODE_SCALE = 0.5;
const MONITOR_CODE_ANGLE = -Math.PI * 0.1;

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

const TV_CODE_X = TV_X - 2.75;
const TV_CODE_Y = TV_Y + 0.2;
const TV_CODE_Z = TV_Z - 2.4;
const TV_CODE_SCALE = 2;
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
}

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
		path: "models_optimized/alexandra_cardenas_livecoding_d5.glb",
		label: "alexandra_cardenas_livecoding_d5.glb",
		position: [MONITOR_CODE_X, MONITOR_CODE_Y, MONITOR_CODE_Z],
		scale: MONITOR_CODE_SCALE,
		floatSpeed: 0,
		floatIntensity: 0,
		rotationY: MONITOR_CODE_ANGLE,
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
		path: "models_optimized/alexandra_cardenas_code.glb",
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
		scale: BAR_TABLE_SCALE,
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
useGLTF.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");

MODEL_CONFIG.forEach(({ path }) => {
	const model = import.meta.env.BASE_URL + path;
	useGLTF.preload(model);
});

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

	const { scene } = useGLTF(url) as GLTF & { scene: THREE.Group };
	const cloned = useMemo(() => {
		const c = scene.clone(true);
		c.traverse((obj) => {
			const mesh = obj as THREE.Mesh;
			if ((mesh as THREE.Mesh).isMesh) {
				mesh.castShadow = true;
				mesh.receiveShadow = true;
				// Crisp textures on distant/large surfaces — kills pixelation.
				const mat = mesh.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[];
				const mats = Array.isArray(mat) ? mat : [mat];
				mats.forEach((m) => {
					if (!m) return;
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
			{/* Humid post-rain ambient — warm, low */}
			<ambientLight color='#ffe6c2' intensity={0.35} />

			{/* Bright cloudy sky + warm earth bounce */}
			<hemisphereLight args={["#fff1d6", "#b89878", 0.9]} />

			{/* Warm sun — behind far side of mountain, aimed down at pergola.
			    Acts like a natural spotlight via the target object. */}
			<primitive object={sunTarget} />
			<directionalLight
				color='#ffd9a0'
				intensity={3.0}
				position={[PERGOLA_X - 45, PERGOLA_Y + 55, PERGOLA_Z - 40]}
				target={sunTarget}
				castShadow
				shadow-mapSize-width={2048}
				shadow-mapSize-height={2048}
				shadow-bias={-0.0005}
				shadow-normalBias={0.02}
				shadow-camera-near={0.5}
				shadow-camera-far={140}
				shadow-camera-left={-22}
				shadow-camera-right={22}
				shadow-camera-top={22}
				shadow-camera-bottom={-22}
			/>

			{/* Desk lamp — warm, low, casts shadows */}
			<pointLight
				color='#ffb870'
				intensity={6}
				distance={4}
				decay={2}
				position={[DESK_LAMP_X, DESK_LAMP_Y + 0.2, DESK_LAMP_Z]}
				castShadow
				shadow-mapSize-width={1024}
				shadow-mapSize-height={1024}
				shadow-bias={-0.0005}
			/>

			{/* Coffee-table / floor lamp — warm, low, casts shadows */}
			<pointLight
				color='#ffb870'
				intensity={7}
				distance={5}
				decay={2}
				position={[FLOOR_LAMP_X, FLOOR_LAMP_Y + 2.2, FLOOR_LAMP_Z]}
				castShadow
				shadow-mapSize-width={1024}
				shadow-mapSize-height={1024}
				shadow-bias={-0.0005}
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

// ─── Static-shadow freezer ───────────────────────────────────────────────────
// One-shot bake: disable per-frame shadow map updates once everything is loaded.
// Shadows stay correct (scene is static) but cost zero per frame afterwards.
function ShadowFreezer() {
	const { gl } = useThree();
	useEffect(() => {
		gl.shadowMap.autoUpdate = true;
		gl.shadowMap.needsUpdate = true;
		const t = setTimeout(() => {
			gl.shadowMap.autoUpdate = false;
		}, 600);
		return () => clearTimeout(t);
	}, [gl]);
	return null;
}

// ─── Camera presets ──────────────────────────────────────────────────────────
type PresetKey = "workstation" | "meeting" | "balcony";

interface CameraPreset {
	position: [number, number, number];
	target: [number, number, number];
}

const CAMERA_PRESETS: Record<PresetKey, CameraPreset> = {
	workstation: {
		// Pulled back-right of desk, slightly above chair height, looking at monitors.
		position: [DESK_X + 4.5, DESK_Y + 2.2, DESK_Z + 4],
		target: [DESK_X - 2.5, DESK_Y + 0.6, DESK_Z - 0.8],
	},
	meeting: {
		// Close/intimate: sofa + coffee-table + TV + floor lamp in frame.
		position: [COFFEE_TABLE_X + 3, COFFEE_TABLE_Y + 1.8, COFFEE_TABLE_Z + 3.2],
		target: [COFFEE_TABLE_X - 1.2, COFFEE_TABLE_Y + 0.8, COFFEE_TABLE_Z],
	},
	balcony: {
		// Behind the balcony looking outward over the fence toward the mountain view.
		position: [MUD_X + 1, MUD_Y + 3, MUD_Z + 5.5],
		target: [MUD_X, MUD_Y + 1, MUD_Z - 12],
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
}: {
	position: [number, number, number];
	color: string;
	label: string;
	onClick: () => void;
	size?: number;
}) {
	const [hovered, setHovered] = useState(false);
	const meshRef = useRef<THREE.Mesh>(null);

	useFrame(({ clock }) => {
		if (!meshRef.current) return;
		const t = clock.getElapsedTime();
		// Gentle pulse — stronger on hover.
		const pulse = 1 + Math.sin(t * 2.5) * (hovered ? 0.12 : 0.06);
		meshRef.current.scale.setScalar(pulse);
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
		[onClick],
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
function MonitorPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
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
					Popup opened. Placeholder interaction triggered from the middle monitor.
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

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene({
	activePreset,
	setActivePreset,
	onOpenPopup,
}: {
	activePreset: PresetKey;
	setActivePreset: (p: PresetKey) => void;
	onOpenPopup: () => void;
}) {
	const controlsRef = useRef<OrbitControlsImpl>(null);

	return (
		<>
			<PostRainSummerLighting />
			<CameraTracker controlsRef={controlsRef} />
			<CameraRig activePreset={activePreset} controlsRef={controlsRef} />

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

				{/* Button 1 — Workstation (floats above desk corner, near laptop) */}
				<SceneButton3D
					position={[DESK_X + 1.4, DESK_Y + 1.2, DESK_Z + 0.6]}
					color='#e88a3a'
					label='Workstation'
					onClick={() => setActivePreset("workstation")}
					size={0.12}
				/>

				{/* Button 2 — Meeting area (above coffee table) */}
				<SceneButton3D
					position={[COFFEE_TABLE_X, COFFEE_TABLE_Y + 0.6, COFFEE_TABLE_Z]}
					color='#6aa5d8'
					label='Meeting Area'
					onClick={() => setActivePreset("meeting")}
					size={0.12}
				/>

				{/* Button 3 — Balcony (above fence) */}
				<SceneButton3D
					position={[MUD_X, MUD_Y + 1.4, MUD_Z - 1.3]}
					color='#7fc27f'
					label='Balcony'
					onClick={() => setActivePreset("balcony")}
					size={0.12}
				/>

				{/* Button 4 — Monitor popup trigger (on middle monitor face) */}
				<SceneButton3D
					position={[MONITOR_B_X - 0.05, MONITOR_B_Y + 0.5, MONITOR_B_Z + 0.25]}
					color='#e84a6a'
					label='Open'
					onClick={() => {
						console.log("Popup opened");
						onOpenPopup();
					}}
					size={0.08}
				/>

				<BakeShadows />
				<ShadowFreezer />
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
				}}
			>
				<Scene
					activePreset={activePreset}
					setActivePreset={setActivePreset}
					onOpenPopup={() => setPopupOpen(true)}
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
					] as { key: PresetKey; label: string; color: string }[]
				).map((b) => (
					<button
						key={b.key}
						onClick={() => setActivePreset(b.key)}
						style={{
							background: activePreset === b.key ? b.color : "rgba(30,20,10,0.75)",
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
