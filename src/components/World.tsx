import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Float } from "@react-three/drei";
import type { GLTF, OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

// ─── Model config ────────────────────────────────────────────────────────────
//
//  SCENE LAYOUT (top-down):
//
//    [Mountain] — massive, fills viewport, camera looks slightly upward
//        └── [Terrace]  — glass terrace sitting on the summit plateau
//                └── [Desk]      — Scandinavian desk on the terrace floor
//                       ├── [Monitors]  — dual monitors on desk surface
//                       ├── [Keyboard]  — keyboard in front of monitors
//                       └── [Laptop]    — laptop beside keyboard
//             └── [Chair]       — pulled up to the desk
//
//  All Y values are world-space.  Tune them if model origins differ.
//  DESK_Y  = terrace floor height (~4.6)
//  SURF_Y  = desk surface height  (~5.45 = DESK_Y + ~0.85)
// ─────────────────────────────────────────────────────────────────────────────

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

// const GARDEN_TABLE_X = PERGOLA_X - 4;
// const GARDEN_TABLE_Y = PERGOLA_Y + 7.8;
// const GARDEN_TABLE_Z = PERGOLA_Z + 8;
// const GARDEN_TABLE_SCALE = 0.01;

// const GARDEN_CHAIR_FIRST_X = GARDEN_TABLE_X;
// const GARDEN_CHAIR_FIRST_Y = GARDEN_TABLE_Y;
// const GARDEN_CHAIR_FIRST_Z = GARDEN_TABLE_Z + 0.6;
// const GARDEN_CHAIR_FIRST_SCALE = 0.01;
// const GARDEN_CHAIR_FIRST_ANGLE = Math.PI;

// const GARDEN_CHAIR_SECOND_X = GARDEN_TABLE_X;
// const GARDEN_CHAIR_SECOND_Y = GARDEN_TABLE_Y;
// const GARDEN_CHAIR_SECOND_Z = GARDEN_TABLE_Z - 0.6;
// const GARDEN_CHAIR_SECOND_SCALE = 0.01;
// const GARDEN_CHAIR_SECOND_ANGLE = Math.PI * 2;

// const GARDEN_CHAIR_THIRD_X = GARDEN_TABLE_X - 0.6;
// const GARDEN_CHAIR_THIRD_Y = GARDEN_TABLE_Y;
// const GARDEN_CHAIR_THIRD_Z = GARDEN_TABLE_Z;
// const GARDEN_CHAIR_THIRD_SCALE = 0.01;
// const GARDEN_CHAIR_THIRD_ANGLE = Math.PI / 2;

// const GARDEN_CHAIR_FOURTH_X = GARDEN_TABLE_X + 0.6;
// const GARDEN_CHAIR_FOURTH_Y = GARDEN_TABLE_Y;
// const GARDEN_CHAIR_FOURTH_Z = GARDEN_TABLE_Z;
// const GARDEN_CHAIR_FOURTH_SCALE = 0.01;
// const GARDEN_CHAIR_FOURTH_ANGLE = -Math.PI / 2;

// const STRAW_MAT_X = GARDEN_TABLE_X;
// const STRAW_MAT_Y = GARDEN_TABLE_Y;
// const STRAW_MAT_Z = GARDEN_TABLE_Z;
// const STRAW_MAT_SCALE = 2;

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
const PLANT_GERANIUM_D_X = MUD_X + 1.3; // was -1
const PLANT_GERANIUM_E_X = MUD_X + 7; // was -4.7
const PLANT_GERANIUM_Y = MUD_Y;
const PLANT_GERANIUM_A_Z = MUD_Z - 1.1;
const PLANT_GERANIUM_B_Z = MUD_Z - 1.2;
const PLANT_GERANIUM_C_Z = MUD_Z - 0.7;
const PLANT_GERANIUM_D_Z = MUD_Z - 0.6; // was -1.2
const PLANT_GERANIUM_E_Z = MUD_Z - 0.55; // was -0.7
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
const PLANT_LUPINE_D_Z = MUD_Z - 0.4; // was -0.9
const PLANT_LUPINE_A_SCALE = 1;
const PLANT_LUPINE_B_SCALE = 0.8;
const PLANT_LUPINE_C_SCALE = 0.95; // was 1
const PLANT_LUPINE_D_SCALE = 0.85; // was 0.8
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
const PLANT_CROTON_D_Z = MUD_Z - 1.1; // was -0.35
const PLANT_CROTON_A_SCALE = 0.25;
const PLANT_CROTON_B_SCALE = 0.22;
const PLANT_CROTON_C_SCALE = 0.24;
const PLANT_CROTON_D_SCALE = 0.28; // was 0.3
const PLANT_CROTON_A_ANGLE = Math.PI * 1.5;
const PLANT_CROTON_B_ANGLE = -Math.PI * 1.5;
const PLANT_CROTON_C_ANGLE = Math.PI * 1.85;
const PLANT_CROTON_D_ANGLE = Math.PI / 2; // slight offset

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
    path: "/models/weisse_wand_mountain_peek_2517_m_8257_ft_m.glb",
    label: "Mountain Peak",
    position: [0, MOUNTAIN_Y, 0],
    scale: MOUNTAIN_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
  },

  {
    path: "/models/pergola.glb",
    label: "Glass Terrace",
    position: [PERGOLA_X, PERGOLA_Y, PERGOLA_Z],
    scale: [PERGOLA_SCALE * 0.8, PERGOLA_SCALE * 0.5, PERGOLA_SCALE * 1.2],
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: PERGOLA_ANGLE,
  },

  {
    path: "/models/jenson_extending_dining_table_solid_oak.glb",
    label: "Desk",
    position: [DESK_X, DESK_Y, DESK_Z],
    scale: [DESK_SCALE * 1.8, DESK_SCALE * 0.9, DESK_SCALE * 1.2],
    floatSpeed: 0,
    floatIntensity: 0,
  },

  {
    path: "/models/harvey_swivel_chair_mineral_blue.glb",
    label: "Chair",
    position: [OFFICE_CHAIR_X, OFFICE_CHAIR_Y, OFFICE_CHAIR_Z],
    scale: OFFICE_CHAIR_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: Math.PI,
  },

  {
    path: "/models/monitor.glb",
    label: "Monitor Left",
    position: [MONITOR_A_X, MONITOR_A_Y, MONITOR_A_Z],
    scale: 1.2,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: MONITOR_A_ANGLE,
  },
  {
    path: "/models/monitor.glb",
    label: "Monitor Right",
    position: [MONITOR_B_X, MONITOR_B_Y, MONITOR_B_Z],
    scale: 1.2,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: MONITOR_B_ANGLE,
  },
  {
    path: "/models/monitor.glb",
    label: "Monitor Right",
    position: [MONITOR_C_X, MONITOR_C_Y, MONITOR_C_Z],
    scale: 1.2,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: MONITOR_C_ANGLE,
  },

  {
    path: "/models/alexandra_cardenas_livecoding_d5.glb",
    label: "alexandra_cardenas_livecoding_d5.glb",
    position: [MONITOR_CODE_X, MONITOR_CODE_Y, MONITOR_CODE_Z],
    scale: MONITOR_CODE_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: MONITOR_CODE_ANGLE,
  },
  {
    path: "/models/mac_keyboard.glb",
    label: "Keyboard",
    position: [KEYBOARD_X, KEYBOARD_Y, KEYBOARD_Z],
    scale: 0.007,
    floatSpeed: 0,
    floatIntensity: 0,
  },
  {
    path: "/models/mousepad.glb",
    label: "pad",
    position: [PAD_X, PAD_Y, PAD_Z],
    scale: [PAD_SCALE * 0.9, PAD_SCALE, PAD_SCALE * 1.2],

    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: PAD_ANGLE,
  },
  {
    path: "/models/lowpoly_laptop_closed.glb",
    label: "Laptop",
    position: [LAPTOP_X, LAPTOP_Y, LAPTOP_Z],
    scale: 1.8,
    floatSpeed: 0,
    floatIntensity: 0,
  },
  {
    path: "/models/the_serpent_-_tret030.glb",
    label: "DESK_LAMP",
    position: [DESK_LAMP_X, DESK_LAMP_Y, DESK_LAMP_Z],
    scale: DESK_LAMP_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: DESK_LAMP_ANGLE,
  },
  {
    path: "/models/imac_magic_mouse.glb",
    label: "mouse",
    position: [MOUSE_X, MOUSE_Y, MOUSE_Z],
    scale: 1.5,
    floatSpeed: 0,
    floatIntensity: 0,
  },
  {
    path: "/models/mug.glb",
    label: "Mug",
    position: [MUG_X, MUG_Y, MUG_Z],
    scale: MUG_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: MUG_ANGLE,
  },
  {
    path: "/models/unhyun__straw_mat_a.glb",
    label: "COASTER",
    position: [COASTER_X, COASTER_Y, COASTER_Z],
    scale: COASTER_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: COASTER_ANGLE,
  },
  {
    path: "/models/rug.glb",
    label: "rug office",
    position: [RUG_OFFICE_X, RUG_OFFICE_Y, RUG_OFFICE_Z],
    scale: [RUG_OFFICE_SCALE * 1.85, RUG_OFFICE_SCALE, RUG_OFFICE_SCALE * 2.5],
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: RUG_OFFICE_ANGLE,
  },
  {
    path: "/models/alexandra_cardenas_code.glb",
    label: "TV_CODE",
    position: [TV_CODE_X, TV_CODE_Y, TV_CODE_Z],
    scale: TV_CODE_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: TV_CODE_ANGLE,
  },
  {
    path: "/models/tv_with_a_wall_mount.glb",
    label: "TV",
    position: [TV_X, TV_Y, TV_Z],
    scale: TV_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: TV_ANGLE,
  },
  {
    path: "/models/ipad_air4.glb",
    label: "tablet",
    position: [TABLET_X, TABLET_Y, TABLET_Z],
    scale: TABLET_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: TABLET_ANGLE,
  },

  {
    path: "/models/bush_square.glb",
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
    path: "/models/bush_square.glb",
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
    path: "/models/bush_square.glb",
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
    path: "/models/green_creeper_plant.glb",
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
    path: "/models/green_creeper_plant.glb",
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
    path: "/models/irvin_floor_lamp_natural_wood_and_white.glb",
    label: "FLOOR_LAMP",
    position: [FLOOR_LAMP_X, FLOOR_LAMP_Y, FLOOR_LAMP_Z],
    scale: FLOOR_LAMP_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: FLOOR_LAMP_ANGLE,
  },
  {
    path: "/models/Untitled.glb",
    label: "Armchair",
    position: [ARMCHAIR_X, ARMCHAIR_Y, ARMCHAIR_Z],
    scale: ARMCHAIR_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: ARMCHAIR_ANGLE,
  },
  {
    path: "/models/dylan_2_seater_sofa_mineral_blue.glb",
    label: "sofa",
    position: [SOFA_X, SOFA_Y, SOFA_Z],
    scale: [SOFA_SCALE * 1.3, SOFA_SCALE, SOFA_SCALE],
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: SOFA_ANGLE,
  },
  {
    path: "/models/pillow_test.glb",
    label: "pillow",
    position: [PILLOW_X, PILLOW_Y, PILLOW_Z],
    scale: PILLOW_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: PILLOW_ANGLE,
  },
  {
    path: "/models/edelweiss_round_table_ash_and_white.glb",
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
    path: "/models/rug.glb",
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
    path: "/models/edelweiss_bar_table_ash_and_white.glb",
    label: "bar table",
    position: [BAR_TABLE_X, BAR_TABLE_Y, BAR_TABLE_Z],
    scale: BAR_TABLE_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
  },
  {
    path: "/models/set_of_2_edelweiss_bar_chairs_white.glb",
    label: "bar chair first",
    position: [BAR_CHAIR_FIRST_X, BAR_CHAIR_FIRST_Y, BAR_CHAIR_FIRST_Z],
    scale: BAR_CHAIR_FIRST_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: BAR_CHAIR_FIRST_ANGLE,
  },

  {
    path: "/models/set_of_2_edelweiss_bar_chairs_white.glb",
    label: "bar chair second",
    position: [BAR_CHAIR_SECOND_X, BAR_CHAIR_SECOND_Y, BAR_CHAIR_SECOND_Z],
    scale: BAR_CHAIR_SECOND_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: BAR_CHAIR_SECOND_ANGLE,
  },
  {
    path: "/models/shoe_cabinet.glb",
    label: "shelf",
    position: [SHELF_X, SHELF_Y, SHELF_Z],
    scale: [SHELF_SCALE * 2.5, SHELF_SCALE * 0.7, SHELF_SCALE * 1.2],
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: 0, //SHELF_ANGLE,
  },
  // {
  //   path: "/models/stack_of_books_3d_scan.glb",
  //   label: "books",
  //   position: [BOOKS_X, BOOKS_Y, BOOKS_Z],
  //   scale: BOOKS_SCALE, //[BOOKS_SCALE * 1.4, BOOKS_SCALE * 1.1, BOOKS_SCALE * 0.4],
  //   floatSpeed: 0,
  //   floatIntensity: 0,
  //   rotationY: BOOKS_ANGLE,
  // },
  {
    path: "/models/mud_material.glb",
    label: "mud",
    position: [MUD_X, MUD_Y, MUD_Z],
    scale: [MUD_SCALE * 3, MUD_SCALE, MUD_SCALE * 0.5],
    floatSpeed: 0,
    floatIntensity: 0,
  },
  {
    path: "/models/wooden_fence.glb",
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
    path: "/models/wooden_fence.glb",
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
    path: "/models/wooden_fence.glb",
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
    path: "/models/wooden_fence.glb",
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
    path: "/models/wooden_fence.glb",
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
    path: "/models/realistic_hd_chinese_jungle_geranium_310.glb",
    label: "jungle geranium",
    position: [PLANT_GERANIUM_A_X, PLANT_GERANIUM_Y, PLANT_GERANIUM_A_Z],
    scale: PLANT_GERANIUM_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: PLANT_GERANIUM_A_ANGLE,
  },
  {
    path: "/models/realistic_hd_chinese_jungle_geranium_310.glb",
    label: "jungle geranium",
    position: [PLANT_GERANIUM_B_X, PLANT_GERANIUM_Y, PLANT_GERANIUM_B_Z],
    scale: PLANT_GERANIUM_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: PLANT_GERANIUM_B_ANGLE,
  },
  {
    path: "/models/realistic_hd_chinese_jungle_geranium_310.glb",
    label: "jungle geranium",
    position: [PLANT_GERANIUM_C_X, PLANT_GERANIUM_Y, PLANT_GERANIUM_C_Z],
    scale: PLANT_GERANIUM_C_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: PLANT_GERANIUM_C_ANGLE,
  },

  {
    path: "/models/realistic_hd_chinese_jungle_geranium_310.glb",
    label: "jungle geranium",
    position: [PLANT_GERANIUM_D_X, PLANT_GERANIUM_Y, PLANT_GERANIUM_D_Z],
    scale: PLANT_GERANIUM_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: PLANT_GERANIUM_D_ANGLE,
  },
  {
    path: "/models/realistic_hd_chinese_jungle_geranium_310.glb",
    label: "jungle geranium",
    position: [PLANT_GERANIUM_E_X, PLANT_GERANIUM_Y, PLANT_GERANIUM_E_Z],
    scale: PLANT_GERANIUM_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: PLANT_GERANIUM_E_ANGLE,
  },

  {
    path: "/models/realistic_hd_windmill_palm_1625.glb",
    label: "jungle PALM",
    position: [PLANT_PALM_A_X, PLANT_PALM_Y, PLANT_PALM_A_Z],
    scale: PLANT_PALM_A_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: PLANT_PALM_A_ANGLE,
  },
  {
    path: "/models/realistic_hd_windmill_palm_1625.glb",
    label: "jungle PALM",
    position: [PLANT_PALM_B_X, PLANT_PALM_Y, PLANT_PALM_B_Z],
    scale: PLANT_PALM_B_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: PLANT_PALM_B_ANGLE,
  },
  {
    path: "/models/realistic_hd_large-leaved_lupine_318.glb",
    label: "jungle LUPINE",
    position: [PLANT_LUPINE_A_X, PLANT_LUPINE_Y, PLANT_LUPINE_A_Z],
    scale: PLANT_LUPINE_A_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: PLANT_LUPINE_A_ANGLE,
  },
  {
    path: "/models/realistic_hd_large-leaved_lupine_318.glb",
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
    path: "/models/realistic_hd_large-leaved_lupine_318.glb",
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
    path: "/models/realistic_hd_large-leaved_lupine_318.glb",
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
    path: "/models/dwarf_snowflake_mock_orange_flowers_spring.glb",
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
    path: "/models/dwarf_snowflake_mock_orange_flowers_spring.glb",
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
    path: "/models/dwarf_snowflake_mock_orange_flowers_spring.glb",
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
    path: "/models/dwarf_snowflake_mock_orange_flowers_spring.glb",
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
    path: "/models/croton_leaf_plants.glb",
    label: "jungle CROTON",
    position: [PLANT_CROTON_A_X, PLANT_CROTON_Y, PLANT_CROTON_A_Z],
    scale: PLANT_CROTON_A_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: PLANT_CROTON_A_ANGLE,
  },
  {
    path: "/models/croton_leaf_plants.glb",
    label: "jungle CROTON",
    position: [PLANT_CROTON_B_X, PLANT_CROTON_Y, PLANT_CROTON_B_Z],
    scale: PLANT_CROTON_B_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: PLANT_CROTON_B_ANGLE,
  },
  {
    path: "/models/croton_leaf_plants.glb",
    label: "jungle CROTON",
    position: [PLANT_CROTON_C_X, PLANT_CROTON_Y, PLANT_CROTON_C_Z],
    scale: PLANT_CROTON_C_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: PLANT_CROTON_C_ANGLE,
  },
  {
    path: "/models/croton_leaf_plants.glb",
    label: "jungle CROTON",
    position: [PLANT_CROTON_D_X, PLANT_CROTON_Y, PLANT_CROTON_D_Z],
    scale: PLANT_CROTON_D_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: PLANT_CROTON_D_ANGLE,
  },
  {
    path: "/models/wisteria_sinensis005.glb",
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
    path: "/models/wisteria_sinensis005.glb",
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
    path: "/models/realistic_hd_chinese_jungle_geranium_710.glb",
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
    path: "/models/realistic_hd_chinese_jungle_geranium_710.glb",
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
    path: "/models/realistic_hd_chinese_jungle_geranium_710.glb",
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
    path: "/models/realistic_hd_chinese_jungle_geranium_710.glb",
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
  // {
  //   path: "/models/edelweiss_round_table_ash_and_white.glb",
  //   label: "garden table",
  //   position: [GARDEN_TABLE_X, GARDEN_TABLE_Y, GARDEN_TABLE_Z],
  //   scale: GARDEN_TABLE_SCALE,
  //   floatSpeed: 0,
  //   floatIntensity: 0,
  // },
  // {
  //   path: "/models/set_of_2_edelweiss_dining_chairs_ash_white.glb",
  //   label: "garden chair first",
  //   position: [
  //     GARDEN_CHAIR_FIRST_X,
  //     GARDEN_CHAIR_FIRST_Y,
  //     GARDEN_CHAIR_FIRST_Z,
  //   ],
  //   scale: GARDEN_CHAIR_FIRST_SCALE,
  //   floatSpeed: 0,
  //   floatIntensity: 0,
  //   rotationY: GARDEN_CHAIR_FIRST_ANGLE,
  // },

  // {
  //   path: "/models/set_of_2_edelweiss_dining_chairs_ash_white.glb",
  //   label: "garden chair second",
  //   position: [
  //     GARDEN_CHAIR_SECOND_X,
  //     GARDEN_CHAIR_SECOND_Y,
  //     GARDEN_CHAIR_SECOND_Z,
  //   ],
  //   scale: GARDEN_CHAIR_SECOND_SCALE,
  //   floatSpeed: 0,
  //   floatIntensity: 0,
  //   rotationY: GARDEN_CHAIR_SECOND_ANGLE,
  // },

  // {
  //   path: "/models/set_of_2_edelweiss_dining_chairs_ash_white.glb",
  //   label: "garden chair third",
  //   position: [
  //     GARDEN_CHAIR_THIRD_X,
  //     GARDEN_CHAIR_THIRD_Y,
  //     GARDEN_CHAIR_THIRD_Z,
  //   ],
  //   scale: GARDEN_CHAIR_THIRD_SCALE,
  //   floatSpeed: 0,
  //   floatIntensity: 0,
  //   rotationY: GARDEN_CHAIR_THIRD_ANGLE,
  // },

  // {
  //   path: "/models/set_of_2_edelweiss_dining_chairs_ash_white.glb",
  //   label: "garden chair fourth",
  //   position: [
  //     GARDEN_CHAIR_FOURTH_X,
  //     GARDEN_CHAIR_FOURTH_Y,
  //     GARDEN_CHAIR_FOURTH_Z,
  //   ],
  //   scale: GARDEN_CHAIR_FOURTH_SCALE,
  //   floatSpeed: 0,
  //   floatIntensity: 0,
  //   rotationY: GARDEN_CHAIR_FOURTH_ANGLE,
  // },

  // {
  //   path: "/models/unhyun__straw_mat_a.glb",
  //   label: "STRAW MAT",
  //   position: [STRAW_MAT_X, STRAW_MAT_Y, STRAW_MAT_Z],
  //   scale: STRAW_MAT_SCALE,
  //   floatSpeed: 0,
  //   floatIntensity: 0,
  // },
  {
    path: "/models/free_pothos_potted_plant_-_money_plant.glb",
    label: "plant_money",
    position: [PLANT_MONEY_X, PLANT_MONEY_Y, PLANT_MONEY_Z],
    scale: PLANT_MONEY_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
  },
  // {
  //   path: "/models/ficus_lyrata_-_plants.glb",
  //   label: "wall",
  //   position: [PLANT_FICUS_X, PLANT_FICUS_Y, PLANT_FICUS_Z],
  //   scale: PLANT_FICUS_SCALE,
  //   floatSpeed: 0,
  //   floatIntensity: 0,
  // },

  {
    path: "/models/jenson_sideboard_solid_oak.glb",
    label: "bookcase",
    position: [BOOKCASE_X, BOOKCASE_Y, BOOKCASE_Z],
    scale: [BOOKCASE_SCALE * 2.4, BOOKCASE_SCALE, BOOKCASE_SCALE * 1.5],
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: BOOKCASE_ANGLE,
  },

  {
    path: "/models/fruit_basket.glb",
    label: "ORANGE_FLOWERS",
    position: [FRUITS_X, FRUITS_Y, FRUITS_Z],
    scale: FRUITS_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
  },
  {
    path: "/models/teapot.glb",
    label: "ORANGE_FLOWERS",
    position: [TEA_X, TEA_Y, TEA_Z],
    scale: TEA_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
    rotationY: TEA_ANGLE,
  },

  {
    path: "/models/nespresso_machine_2.glb",
    label: "ORANGE_FLOWERS",
    position: [COFFEE_X, COFFEE_Y, COFFEE_Z],
    scale: COFFEE_SCALE,
    floatSpeed: 0,
    floatIntensity: 0,
  },

  // {
  //   path: "/models/outdoor_decoration_plants_flower.glb",
  //   label: "flowers",
  //   position: [PLANT_FLOWERS_X, PLANT_FLOWERS_Y, PLANT_FLOWERS_Z],
  //   scale: PLANT_FLOWERS_SCALE,
  //   floatSpeed: 0,
  //   floatIntensity: 0,
  // },
  // {
  //   path: "/models/aglaonema_plant.glb",
  //   label: "AGLAONEMA",
  //   position: [PLANT_AGLAONEMA_X, PLANT_AGLAONEMA_Y, PLANT_AGLAONEMA_Z],
  //   scale: PLANT_AGLAONEMA_SCALE,
  //   floatSpeed: 0,
  //   floatIntensity: 0,
  // },
  // {
  //   path: "/models/indoor_plants_pack.glb",
  //   label: "INDOOR_PACK",
  //   position: [PLANT_INDOOR_PACK_X, PLANT_INDOOR_PACK_Y, PLANT_INDOOR_PACK_Z],
  //   scale: PLANT_INDOOR_PACK_SCALE,
  //   floatSpeed: 0,
  //   floatIntensity: 0,
  //   rotationY: PLANT_INDOOR_PACK_ANGLE,
  // },
  // {
  //   path: "/models/free__livistona_chinensis_-_fan_palm (1).glb",
  //   label: "FAN",
  //   position: [PLANT_FAN_X, PLANT_FAN_Y, PLANT_FAN_Z],
  //   scale: PLANT_FAN_SCALE,
  //   floatSpeed: 0,
  //   floatIntensity: 0,
  // },
  // {
  //   path: "/models/free_dyspis_lutescens_-_potted_palm.glb",
  //   label: "POTTED_PALM",
  //   position: [PLANT_POTTED_PALM_X, PLANT_POTTED_PALM_Y, PLANT_POTTED_PALM_Z],
  //   scale: PLANT_POTTED_PALM_SCALE,
  //   floatSpeed: 0,
  //   floatIntensity: 0,
  // },
];

MODEL_CONFIG.forEach(({ path }) => useGLTF.preload(path));

// ─── Individual model loader ──────────────────────────────────────────────────
function Model({
  path,
  position,
  scale,
  floatSpeed,
  floatIntensity,
  rotationY = 0,
}: Omit<ModelConfig, "label">) {
  const { scene } = useGLTF(path) as GLTF & { scene: THREE.Group };
  const cloned = scene.clone(true);

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

// ─── Loading fallback ─────────────────────────────────────────────────────────
function Placeholder({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshStandardMaterial color="#fff" wireframe />
    </mesh>
  );
}

// ─── Lighting ─────────────────────────────────────────────────────────────────
// Crisp alpine atmosphere — thin cold air, bright directional sun, blue shadows.
function AlpineLighting() {
  return (
    <>
      {/* Cold-sky ambient fill */}
      <ambientLight color="#dedede" intensity={0.9} />
      <hemisphereLight args={["#dedede", "#dedede", 1.6]} />

      {/* High-altitude sun — sharp, slightly warm white */}
      <directionalLight
        color="#dedede"
        intensity={2.2}
        position={[12, 20, 8]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.01}
        shadow-camera-far={80}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Cool fill light from opposite side — blue alpine shadow */}
      <directionalLight
        color="#dedede"
        intensity={0.6}
        position={[-10, 6, -12]}
        castShadow={false}
      />

      {/* Subtle warm bounce from below (snow reflection) */}
      <directionalLight
        color="#dedede"
        intensity={0.35}
        position={[0, -8, 0]}
        castShadow={false}
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

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene() {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <>
      <AlpineLighting />
      <CameraTracker controlsRef={controlsRef} />

      {MODEL_CONFIG.map((config) => (
        <Suspense
          key={config.position.join(",")}
          fallback={<Placeholder position={config.position} />}
        >
          <Model
            path={config.path}
            position={config.position}
            scale={config.scale}
            floatSpeed={config.floatSpeed}
            floatIntensity={config.floatIntensity}
            rotationY={config.rotationY}
          />
        </Suspense>
      ))}

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={0}
        maxDistance={80}
        //  target={[50, -30, -20]}
        // target={[1, -30, -15]}
        // target={[30, -40, -30]}
        target={[-8.27, -34, -3.16]}
      />
    </>
  );
}

// ─── World (root export) ──────────────────────────────────────────────────────
// Camera: pulled back and slightly low so the mountain fills the frame,
// with the glass terrace + desk visible at the summit.
export default function World() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#fff" }}>
      <Canvas
        camera={{
          position: [0, 4, 55], // deep inside the mountain base, looking up
          fov: 20,
          near: 0.1,
          far: 600,
        }}
        gl={{ antialias: true, toneMapping: 3 /* ACESFilmic */ }}
        shadows
        onCreated={({ gl }) => {
          gl.setClearColor("#fff");
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
