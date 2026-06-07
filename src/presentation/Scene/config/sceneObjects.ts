import * as P from "./positions";
import type { SceneObject } from "../types";
import { shouldKeepOnMobile } from "./sceneDensity";

export const SCENE_OBJECTS: SceneObject[] = [
  {
    //path: "models_optimized/weisse_wand_mountain_peek_2517_m_8257_ft_m.glb",
    path: "models/mountain_terrain_-_haytor_dartmoor_national_park (1).glb",
    label: "Mountain Peak",
    position: [P.MOUNTAIN_X, P.MOUNTAIN_Y, P.MOUNTAIN_Z],
    scale: [P.MOUNTAIN_SCALE, P.MOUNTAIN_SCALE * 0.4, P.MOUNTAIN_SCALE],
    rotationY: P.MOUNTAIN_ANGLE,
  },
  {
    path: "models/pergola_new_marble_floor (1).glb",
    label: "Glass Terrace",
    position: [P.PERGOLA_X, P.PERGOLA_Y, P.PERGOLA_Z],
    scale: [P.PERGOLA_SCALE, P.PERGOLA_SCALE * 0.7, P.PERGOLA_SCALE],
    rotationY: P.PERGOLA_ANGLE,
  },

  {
    path: "models/office_chair_cream.glb",
    label: "Chair",
    position: [P.OFFICE_CHAIR_X, P.OFFICE_CHAIR_Y, P.OFFICE_CHAIR_Z],
    scale: P.OFFICE_CHAIR_SCALE,
    rotationY: P.OFFICE_CHAIR_ANGLE,
  },
  {
    path: "models_optimized/monitor.glb",
    label: "Monitor Left",
    position: [P.MONITOR_A_X, P.MONITOR_A_Y, P.MONITOR_A_Z],
    scale: P.MONITOR_A_SCALE,
    rotationY: P.MONITOR_A_ANGLE,
  },
  {
    path: "models_optimized/monitor.glb",
    label: "Monitor Right",
    position: [P.MONITOR_B_X, P.MONITOR_B_Y, P.MONITOR_B_Z],
    scale: P.MONITOR_B_SCALE,
    rotationY: P.MONITOR_B_ANGLE,
  },
  {
    path: "models_optimized/monitor.glb",
    label: "Monitor Right",
    position: [P.MONITOR_C_X, P.MONITOR_C_Y, P.MONITOR_C_Z],
    scale: P.MONITOR_C_SCALE,
    rotationY: P.MONITOR_C_ANGLE,
  },
  {
    path: "models_optimized/mac_keyboard.glb",
    label: "Keyboard",
    position: [P.KEYBOARD_X, P.KEYBOARD_Y, P.KEYBOARD_Z],
    scale: P.KEYBOARD_SCALE,
    rotationY: P.KEYBOARD_ANGLE,
  },
  // {
  //   path: "models_optimized/mousepad.glb",
  //   label: "pad",
  //   position: [P.PAD_X, P.PAD_Y, P.PAD_Z],
  //   scale: [P.PAD_SCALE * 0.9, P.PAD_SCALE, P.PAD_SCALE * 1.2],
  //   rotationY: P.PAD_ANGLE,
  // },
  {
    path: "models_optimized/lowpoly_laptop_closed.glb",
    label: "Laptop",
    position: [P.LAPTOP_X, P.LAPTOP_Y, P.LAPTOP_Z],
    scale: P.LAPTOP_SCALE,
    rotationY: P.LAPTOP_ANGLE,
  },
  {
    path: "models_optimized/the_serpent_-_tret030.glb",
    label: "DESK_LAMP",
    position: [P.DESK_LAMP_X, P.DESK_LAMP_Y, P.DESK_LAMP_Z],
    scale: P.DESK_LAMP_SCALE,
    rotationY: P.DESK_LAMP_ANGLE,
  },
  {
    path: "models_optimized/imac_magic_mouse.glb",
    label: "mouse",
    position: [P.MOUSE_X, P.MOUSE_Y, P.MOUSE_Z],
    scale: P.MOUSE_SCALE,
    rotationY: P.MOUSE_ANGLE,
  },
  {
    path: "models_optimized/mug.glb",
    label: "Mug",
    position: [P.MUG_X, P.MUG_Y, P.MUG_Z],
    scale: P.MUG_SCALE,
    rotationY: P.MUG_ANGLE,
  },
  {
    path: "models_optimized/unhyun__straw_mat_a.glb",
    label: "COASTER",
    position: [P.COASTER_X, P.COASTER_Y, P.COASTER_Z],
    scale: P.COASTER_SCALE,
    rotationY: P.COASTER_ANGLE,
  },

  {
    path: "models_optimized/welcome_text.glb",
    label: "TV_CODE",
    position: [P.TV_CODE_X, P.TV_CODE_Y, P.TV_CODE_Z],
    scale: P.TV_CODE_SCALE,
    rotationY: P.TV_CODE_ANGLE,
  },
  {
    path: "models_optimized/tv_with_a_wall_mount.glb",
    label: "TV",
    position: [P.TV_X, P.TV_Y, P.TV_Z],
    scale: P.TV_SCALE,
    rotationY: P.TV_ANGLE,
  },
  {
    path: "models_optimized/ipad_air4.glb",
    label: "tablet",
    position: [P.TABLET_X, P.TABLET_Y, P.TABLET_Z],
    scale: P.TABLET_SCALE,
    rotationY: P.TABLET_ANGLE,
  },
  // ── COMMENTED OUT FOR PERF TEST: balcony/garden plants ──────────────────────
  // {
  //   path: "models_optimized/bush_square.glb",
  //   label: "square",
  //   position: [P.PLANT_SQUARE_X, P.PLANT_SQUARE_Y, P.PLANT_SQUARE_Z],
  //   scale: [
  //     P.PLANT_SQUARE_SCALE * 1.5,
  //     P.PLANT_SQUARE_SCALE * 3,
  //     P.PLANT_SQUARE_SCALE * 3.5,
  //   ],
  //   rotationY: P.PLANT_SQUARE_ANGLE,
  // },
  // {
  //   path: "models_optimized/bush_square.glb",
  //   label: "square",
  //   position: [P.PLANT_SQUARE_B_X, P.PLANT_SQUARE_Y, P.PLANT_SQUARE_B_Z],
  //   scale: [
  //     P.PLANT_SQUARE_SCALE * 1.5,
  //     P.PLANT_SQUARE_SCALE * 3,
  //     P.PLANT_SQUARE_SCALE * 3.5,
  //   ],
  //   rotationY: P.PLANT_SQUARE_B_ANGLE,
  // },
  // {
  //   path: "models_optimized/bush_square.glb",
  //   label: "square",
  //   position: [P.PLANT_SQUARE_C_X, P.PLANT_SQUARE_Y, P.PLANT_SQUARE_C_Z],
  //   scale: [
  //     P.PLANT_SQUARE_SCALE * 1.5,
  //     P.PLANT_SQUARE_SCALE * 3,
  //     P.PLANT_SQUARE_SCALE * 5,
  //   ],
  //   rotationY: P.PLANT_SQUARE_C_ANGLE,
  // },
  // {
  //   path: "models_optimized/green_creeper_plant.glb",
  //   label: "creeper",
  //   position: [
  //     P.PLANT_CREEPER_LEFT_X,
  //     P.PLANT_CREEPER_LEFT_Y,
  //     P.PLANT_CREEPER_LEFT_Z,
  //   ],
  //   scale: [
  //     P.PLANT_CREEPER_LEFT_SCALE * 1.8,
  //     P.PLANT_CREEPER_LEFT_SCALE * 1.2,
  //     P.PLANT_CREEPER_LEFT_SCALE * 1.2,
  //   ],
  //   rotationY: P.PLANT_CREEPER_LEFT_ANGLE,
  // },
  // {
  //   path: "models_optimized/green_creeper_plant.glb",
  //   label: "creeper",
  //   position: [
  //     P.PLANT_CREEPER_RIGHT_X,
  //     P.PLANT_CREEPER_RIGHT_Y,
  //     P.PLANT_CREEPER_RIGHT_Z,
  //   ],
  //   scale: [
  //     P.PLANT_CREEPER_RIGHT_SCALE * 1.3,
  //     P.PLANT_CREEPER_RIGHT_SCALE * 1.7,
  //     P.PLANT_CREEPER_RIGHT_SCALE * 2,
  //   ],
  //   rotationY: P.PLANT_CREEPER_RIGHT_ANGLE,
  // },
  {
    path: "models_optimized/irvin_floor_lamp_natural_wood_and_white.glb",
    label: "FLOOR_LAMP",
    position: [P.FLOOR_LAMP_X, P.FLOOR_LAMP_Y, P.FLOOR_LAMP_Z],
    scale: P.FLOOR_LAMP_SCALE,
    rotationY: P.FLOOR_LAMP_ANGLE,
  },
  {
    path: "models/ritchie_armchair_barley_beige.glb",
    label: "Armchair",
    position: [P.ARMCHAIR_A_X, P.ARMCHAIR_A_Y, P.ARMCHAIR_A_Z],
    scale: P.ARMCHAIR_A_SCALE,
    rotationY: P.ARMCHAIR_A_ANGLE,
  },
  {
    path: "models/ritchie_armchair_barley_beige.glb",
    label: "Armchair",
    position: [P.ARMCHAIR_B_X, P.ARMCHAIR_B_Y, P.ARMCHAIR_B_Z],
    scale: P.ARMCHAIR_B_SCALE,
    rotationY: P.ARMCHAIR_B_ANGLE,
  },
  {
    path: "models/ritchie_armchair_barley_beige.glb",
    label: "Armchair",
    position: [P.ARMCHAIR_C_X, P.ARMCHAIR_C_Y, P.ARMCHAIR_C_Z],
    scale: P.ARMCHAIR_C_SCALE,
    rotationY: P.ARMCHAIR_C_ANGLE,
  },
  {
    path: "models/ritchie_armchair_barley_beige.glb",
    label: "Armchair",
    position: [P.ARMCHAIR_D_X, P.ARMCHAIR_D_Y, P.ARMCHAIR_D_Z],
    scale: P.ARMCHAIR_D_SCALE,
    rotationY: P.ARMCHAIR_D_ANGLE,
  },
  {
    path: "models/ritchie_armchair_barley_beige.glb",
    label: "Armchair",
    position: [P.ARMCHAIR_E_X, P.ARMCHAIR_E_Y, P.ARMCHAIR_E_Z],
    scale: P.ARMCHAIR_E_SCALE,
    rotationY: P.ARMCHAIR_E_ANGLE,
  },
  {
    path: "models/coffee_table_final (1).glb",
    label: "coffee table",
    position: [P.COFFEE_TABLE_X, P.COFFEE_TABLE_Y, P.COFFEE_TABLE_Z],
    scale: [
      P.COFFEE_TABLE_SCALE,
      P.COFFEE_TABLE_SCALE * 0.85,
      P.COFFEE_TABLE_SCALE,
    ],
  },

  {
    path: "models_optimized/rug_round.glb",
    label: "rug meeting",
    position: [P.RUG_MEETING_X, P.RUG_MEETING_Y, P.RUG_MEETING_Z],
    scale: [
      P.RUG_MEETING_SCALE * 1.25,
      P.RUG_MEETING_SCALE,
      P.RUG_MEETING_SCALE * 1.25,
    ],
  },

  {
    path: "models_optimized/desk.glb",
    label: "Wall Desk",
    position: [P.DESK_X, P.DESK_Y, P.DESK_Z],
    scale: [P.DESK_SCALE * 1.5, P.DESK_SCALE * 0.5, P.DESK_SCALE * 1.5],
  },
  {
    path: "models_optimized/desk.glb",
    label: "Shelf Desk",
    position: [P.SHELF_X, P.SHELF_Y, P.SHELF_Z],
    scale: [P.SHELF_SCALE * 1, P.SHELF_SCALE * 0.8, P.SHELF_SCALE * 1],
  },
  // {
  // 	path: "models/glass_cup.glb",
  // 	label: "Stonecrop",
  // 	position: [P.STONECROP_X, P.STONECROP_Y, P.STONECROP_Z],
  // 	scale: [
  // 		P.STONECROP_SCALE * 3,
  // 		P.STONECROP_SCALE * 0.6,
  // 		P.STONECROP_SCALE * 1.8,
  // 	],
  // 	rotationY: P.STONECROP_ANGLE,
  // },

  {
    path: "models/lilies.glb",
    label: "lilies",
    position: [P.FLOWER_X, P.FLOWER_Y, P.FLOWER_Z],
    scale: P.FLOWER_SCALE, //[P.FLOWER_SCALE * 3, P.FLOWER_SCALE * 0.6, P.FLOWER_SCALE * 1.8],
    rotationY: P.FLOWER_ANGLE,
  },
  // ── COMMENTED OUT FOR PERF TEST: bar area ───────────────────────────────────
  // {
  //   path: "models_optimized/edelweiss_bar_table_ash_and_white.glb",
  //   label: "bar table",
  //   position: [P.BAR_TABLE_X, P.BAR_TABLE_Y, P.BAR_TABLE_Z],
  //   scale: [
  //     P.BAR_TABLE_SCALE * 1.2,
  //     P.BAR_TABLE_SCALE,
  //     P.BAR_TABLE_SCALE * 1.2,
  //   ],
  // },
  // {
  //   path: "models_optimized/set_of_2_edelweiss_bar_chairs_white.glb",
  //   label: "bar chair first",
  //   position: [P.BAR_CHAIR_FIRST_X, P.BAR_CHAIR_FIRST_Y, P.BAR_CHAIR_FIRST_Z],
  //   scale: P.BAR_CHAIR_FIRST_SCALE,
  //   rotationY: P.BAR_CHAIR_FIRST_ANGLE,
  // },
  // {
  //   path: "models_optimized/set_of_2_edelweiss_bar_chairs_white.glb",
  //   label: "bar chair second",
  //   position: [
  //     P.BAR_CHAIR_SECOND_X,
  //     P.BAR_CHAIR_SECOND_Y,
  //     P.BAR_CHAIR_SECOND_Z,
  //   ],
  //   scale: P.BAR_CHAIR_SECOND_SCALE,
  //   rotationY: P.BAR_CHAIR_SECOND_ANGLE,
  // },
  // {
  //   path: "models_optimized/shoe_cabinet.glb",
  //   label: "shelf",
  //   position: [P.SHELF_X, P.SHELF_Y, P.SHELF_Z],
  //   scale: [P.SHELF_SCALE * 2.5, P.SHELF_SCALE * 0.7, P.SHELF_SCALE * 1.2],
  //   rotationY: 0,
  // },
  // ── COMMENTED OUT FOR PERF TEST: garden structures ──────────────────────────
  // {
  //   path: "models_optimized/mud_material.glb",
  //   label: "mud",
  //   position: [P.MUD_X, P.MUD_Y, P.MUD_Z],
  //   scale: [P.MUD_SCALE * 3, P.MUD_SCALE, P.MUD_SCALE * 0.5],
  // },
  // {
  //   path: "models_optimized/wooden_fence.glb",
  //   label: "wooden_fence a",
  //   position: [P.WOODEN_FENCE_A_X, P.WOODEN_FENCE_Y, P.WOODEN_FENCE_Z],
  //   scale: [
  //     P.WOODEN_FENCE_SCALE * 2,
  //     P.WOODEN_FENCE_SCALE * 0.6,
  //     P.WOODEN_FENCE_SCALE * 6,
  //   ],
  //   rotationY: P.WOODEN_FENCE_ANGLE,
  // },
  // {
  //   path: "models_optimized/wooden_fence.glb",
  //   label: "wooden_fence a",
  //   position: [P.WOODEN_FENCE_B_X, P.WOODEN_FENCE_Y, P.WOODEN_FENCE_Z],
  //   scale: [
  //     P.WOODEN_FENCE_SCALE * 2,
  //     P.WOODEN_FENCE_SCALE * 0.6,
  //     P.WOODEN_FENCE_SCALE * 6,
  //   ],
  //   rotationY: P.WOODEN_FENCE_ANGLE,
  // },
  // {
  //   path: "models_optimized/wooden_fence.glb",
  //   label: "wooden_fence a",
  //   position: [P.WOODEN_FENCE_C_X, P.WOODEN_FENCE_Y, P.WOODEN_FENCE_Z],
  //   scale: [
  //     P.WOODEN_FENCE_SCALE * 2,
  //     P.WOODEN_FENCE_SCALE * 0.6,
  //     P.WOODEN_FENCE_SCALE * 6,
  //   ],
  //   rotationY: P.WOODEN_FENCE_ANGLE,
  // },
  // {
  //   path: "models_optimized/wooden_fence.glb",
  //   label: "wooden_fence a",
  //   position: [P.WOODEN_FENCE_D_X, P.WOODEN_FENCE_Y, P.WOODEN_FENCE_Z],
  //   scale: [
  //     P.WOODEN_FENCE_SCALE * 2,
  //     P.WOODEN_FENCE_SCALE * 0.6,
  //     P.WOODEN_FENCE_SCALE * 6,
  //   ],
  //   rotationY: P.WOODEN_FENCE_ANGLE,
  // },
  // {
  //   path: "models_optimized/wooden_fence.glb",
  //   label: "wooden_fence a",
  //   position: [P.WOODEN_FENCE_E_X, P.WOODEN_FENCE_Y, P.WOODEN_FENCE_Z],
  //   scale: [
  //     P.WOODEN_FENCE_SCALE * 2,
  //     P.WOODEN_FENCE_SCALE * 0.6,
  //     P.WOODEN_FENCE_SCALE * 6,
  //   ],
  //   rotationY: P.WOODEN_FENCE_ANGLE,
  // },
  // ── COMMENTED OUT FOR PERF TEST: jungle/garden plants ───────────────────────
  // {
  //   path: "models_optimized/realistic_hd_chinese_jungle_geranium_310.glb",
  //   label: "jungle geranium",
  //   position: [P.PLANT_GERANIUM_A_X, P.PLANT_GERANIUM_Y, P.PLANT_GERANIUM_A_Z],
  //   scale: P.PLANT_GERANIUM_SCALE,
  //   rotationY: P.PLANT_GERANIUM_A_ANGLE,
  // },
  // {
  //   path: "models_optimized/realistic_hd_chinese_jungle_geranium_310.glb",
  //   label: "jungle geranium",
  //   position: [P.PLANT_GERANIUM_B_X, P.PLANT_GERANIUM_Y, P.PLANT_GERANIUM_B_Z],
  //   scale: P.PLANT_GERANIUM_SCALE,
  //   rotationY: P.PLANT_GERANIUM_B_ANGLE,
  // },
  // {
  //   path: "models_optimized/realistic_hd_chinese_jungle_geranium_310.glb",
  //   label: "jungle geranium",
  //   position: [P.PLANT_GERANIUM_C_X, P.PLANT_GERANIUM_Y, P.PLANT_GERANIUM_C_Z],
  //   scale: P.PLANT_GERANIUM_C_SCALE,
  //   rotationY: P.PLANT_GERANIUM_C_ANGLE,
  // },
  // {
  //   path: "models_optimized/realistic_hd_chinese_jungle_geranium_310.glb",
  //   label: "jungle geranium",
  //   position: [P.PLANT_GERANIUM_D_X, P.PLANT_GERANIUM_Y, P.PLANT_GERANIUM_D_Z],
  //   scale: P.PLANT_GERANIUM_SCALE,
  //   rotationY: P.PLANT_GERANIUM_D_ANGLE,
  // },
  // {
  //   path: "models_optimized/realistic_hd_chinese_jungle_geranium_310.glb",
  //   label: "jungle geranium",
  //   position: [P.PLANT_GERANIUM_E_X, P.PLANT_GERANIUM_Y, P.PLANT_GERANIUM_E_Z],
  //   scale: P.PLANT_GERANIUM_SCALE,
  //   rotationY: P.PLANT_GERANIUM_E_ANGLE,
  // },
  // {
  //   path: "models_optimized/realistic_hd_windmill_palm_1625.glb",
  //   label: "jungle PALM",
  //   position: [P.PLANT_PALM_A_X, P.PLANT_PALM_Y, P.PLANT_PALM_A_Z],
  //   scale: P.PLANT_PALM_A_SCALE,
  //   rotationY: P.PLANT_PALM_A_ANGLE,
  // },
  // {
  //   path: "models_optimized/realistic_hd_windmill_palm_1625.glb",
  //   label: "jungle PALM",
  //   position: [P.PLANT_PALM_B_X, P.PLANT_PALM_Y, P.PLANT_PALM_B_Z],
  //   scale: P.PLANT_PALM_B_SCALE,
  //   rotationY: P.PLANT_PALM_B_ANGLE,
  // },
  // {
  //   path: "models_optimized/realistic_hd_large-leaved_lupine_318.glb",
  //   label: "jungle LUPINE",
  //   position: [P.PLANT_LUPINE_A_X, P.PLANT_LUPINE_Y, P.PLANT_LUPINE_A_Z],
  //   scale: P.PLANT_LUPINE_A_SCALE,
  //   rotationY: P.PLANT_LUPINE_A_ANGLE,
  // },
  // {
  //   path: "models_optimized/realistic_hd_large-leaved_lupine_318.glb",
  //   label: "jungle LUPINE",
  //   position: [P.PLANT_LUPINE_B_X, P.PLANT_LUPINE_Y, P.PLANT_LUPINE_B_Z],
  //   scale: [
  //     P.PLANT_LUPINE_B_SCALE * 1.2,
  //     P.PLANT_LUPINE_B_SCALE * 0.8,
  //     P.PLANT_LUPINE_B_SCALE * 1.2,
  //   ],
  //   rotationY: P.PLANT_LUPINE_B_ANGLE,
  // },
  // {
  //   path: "models_optimized/realistic_hd_large-leaved_lupine_318.glb",
  //   label: "jungle LUPINE",
  //   position: [P.PLANT_LUPINE_C_X, P.PLANT_LUPINE_Y, P.PLANT_LUPINE_C_Z],
  //   scale: [
  //     P.PLANT_LUPINE_C_SCALE * 1.2,
  //     P.PLANT_LUPINE_C_SCALE * 0.8,
  //     P.PLANT_LUPINE_C_SCALE * 1.2,
  //   ],
  //   rotationY: P.PLANT_LUPINE_C_ANGLE,
  // },
  // {
  //   path: "models_optimized/realistic_hd_large-leaved_lupine_318.glb",
  //   label: "jungle LUPINE",
  //   position: [P.PLANT_LUPINE_D_X, P.PLANT_LUPINE_Y, P.PLANT_LUPINE_D_Z],
  //   scale: [
  //     P.PLANT_LUPINE_D_SCALE * 1.2,
  //     P.PLANT_LUPINE_D_SCALE * 0.8,
  //     P.PLANT_LUPINE_D_SCALE * 1.2,
  //   ],
  //   rotationY: P.PLANT_LUPINE_D_ANGLE,
  // },
  // {
  //   path: "models_optimized/dwarf_snowflake_mock_orange_flowers_spring.glb",
  //   label: "jungle SNOWFLAKE",
  //   position: [
  //     P.PLANT_SNOWFLAKE_A_X,
  //     P.PLANT_SNOWFLAKE_Y,
  //     P.PLANT_SNOWFLAKE_A_Z,
  //   ],
  //   scale: [
  //     P.PLANT_SNOWFLAKE_A_SCALE * 1.4,
  //     P.PLANT_SNOWFLAKE_A_SCALE * 0.9,
  //     P.PLANT_SNOWFLAKE_A_SCALE * 1.4,
  //   ],
  //   rotationY: P.PLANT_SNOWFLAKE_A_ANGLE,
  // },
  // {
  //   path: "models_optimized/dwarf_snowflake_mock_orange_flowers_spring.glb",
  //   label: "jungle SNOWFLAKE",
  //   position: [
  //     P.PLANT_SNOWFLAKE_B_X,
  //     P.PLANT_SNOWFLAKE_Y,
  //     P.PLANT_SNOWFLAKE_B_Z,
  //   ],
  //   scale: [
  //     P.PLANT_SNOWFLAKE_B_SCALE * 1.4,
  //     P.PLANT_SNOWFLAKE_B_SCALE * 0.7,
  //     P.PLANT_SNOWFLAKE_B_SCALE * 1.4,
  //   ],
  //   rotationY: P.PLANT_SNOWFLAKE_B_ANGLE,
  // },
  // {
  //   path: "models_optimized/dwarf_snowflake_mock_orange_flowers_spring.glb",
  //   label: "jungle SNOWFLAKE",
  //   position: [
  //     P.PLANT_SNOWFLAKE_C_X,
  //     P.PLANT_SNOWFLAKE_Y,
  //     P.PLANT_SNOWFLAKE_C_Z,
  //   ],
  //   scale: [
  //     P.PLANT_SNOWFLAKE_C_SCALE * 1.4,
  //     P.PLANT_SNOWFLAKE_C_SCALE * 0.9,
  //     P.PLANT_SNOWFLAKE_C_SCALE * 1.4,
  //   ],
  //   rotationY: P.PLANT_SNOWFLAKE_C_ANGLE,
  // },
  // {
  //   path: "models_optimized/dwarf_snowflake_mock_orange_flowers_spring.glb",
  //   label: "jungle SNOWFLAKE",
  //   position: [
  //     P.PLANT_SNOWFLAKE_D_X,
  //     P.PLANT_SNOWFLAKE_Y,
  //     P.PLANT_SNOWFLAKE_D_Z,
  //   ],
  //   scale: [
  //     P.PLANT_SNOWFLAKE_D_SCALE * 1.4,
  //     P.PLANT_SNOWFLAKE_D_SCALE * 0.9,
  //     P.PLANT_SNOWFLAKE_D_SCALE * 1.4,
  //   ],
  //   rotationY: P.PLANT_SNOWFLAKE_D_ANGLE,
  // },
  // {
  //   path: "models_optimized/croton_leaf_plants.glb",
  //   label: "jungle CROTON",
  //   position: [P.PLANT_CROTON_A_X, P.PLANT_CROTON_Y, P.PLANT_CROTON_A_Z],
  //   scale: P.PLANT_CROTON_A_SCALE,
  //   rotationY: P.PLANT_CROTON_A_ANGLE,
  // },
  // {
  //   path: "models_optimized/croton_leaf_plants.glb",
  //   label: "jungle CROTON",
  //   position: [P.PLANT_CROTON_B_X, P.PLANT_CROTON_Y, P.PLANT_CROTON_B_Z],
  //   scale: P.PLANT_CROTON_B_SCALE,
  //   rotationY: P.PLANT_CROTON_B_ANGLE,
  // },
  // {
  //   path: "models_optimized/croton_leaf_plants.glb",
  //   label: "jungle CROTON",
  //   position: [P.PLANT_CROTON_C_X, P.PLANT_CROTON_Y, P.PLANT_CROTON_C_Z],
  //   scale: P.PLANT_CROTON_C_SCALE,
  //   rotationY: P.PLANT_CROTON_C_ANGLE,
  // },
  // {
  //   path: "models_optimized/croton_leaf_plants.glb",
  //   label: "jungle CROTON",
  //   position: [P.PLANT_CROTON_D_X, P.PLANT_CROTON_Y, P.PLANT_CROTON_D_Z],
  //   scale: P.PLANT_CROTON_D_SCALE,
  //   rotationY: P.PLANT_CROTON_D_ANGLE,
  // },
  // {
  //   path: "models_optimized/wisteria_sinensis005.glb",
  //   label: "jungle SINENSIS",
  //   position: [P.PLANT_SINENSIS_A_X, P.PLANT_SINENSIS_Y, P.PLANT_SINENSIS_A_Z],
  //   scale: [
  //     P.PLANT_SINENSIS_A_SCALE,
  //     P.PLANT_SINENSIS_A_SCALE * 0.8,
  //     P.PLANT_SINENSIS_A_SCALE,
  //   ],
  //   rotationY: P.PLANT_SINENSIS_A_ANGLE,
  // },
  // {
  //   path: "models_optimized/wisteria_sinensis005.glb",
  //   label: "jungle SINENSIS",
  //   position: [P.PLANT_SINENSIS_B_X, P.PLANT_SINENSIS_Y, P.PLANT_SINENSIS_B_Z],
  //   scale: [
  //     P.PLANT_SINENSIS_B_SCALE,
  //     P.PLANT_SINENSIS_B_SCALE * 0.9,
  //     P.PLANT_SINENSIS_B_SCALE,
  //   ],
  //   rotationY: P.PLANT_SINENSIS_B_ANGLE,
  // },
  // {
  //   path: "models_optimized/realistic_hd_chinese_jungle_geranium_710.glb",
  //   label: "jungle BUSH",
  //   position: [P.PLANT_BUSH_A_X, P.PLANT_BUSH_Y, P.PLANT_BUSH_A_Z],
  //   scale: [
  //     P.PLANT_BUSH_A_SCALE * 1.2,
  //     P.PLANT_BUSH_A_SCALE,
  //     P.PLANT_BUSH_A_SCALE * 1.3,
  //   ],
  //   rotationY: P.PLANT_BUSH_A_ANGLE,
  // },
  // {
  //   path: "models_optimized/realistic_hd_chinese_jungle_geranium_710.glb",
  //   label: "jungle BUSH",
  //   position: [P.PLANT_BUSH_B_X, P.PLANT_BUSH_Y, P.PLANT_BUSH_B_Z],
  //   scale: [
  //     P.PLANT_BUSH_B_SCALE * 1.1,
  //     P.PLANT_BUSH_B_SCALE,
  //     P.PLANT_BUSH_B_SCALE * 1.1,
  //   ],
  //   rotationY: P.PLANT_BUSH_B_ANGLE,
  // },
  // {
  //   path: "models_optimized/realistic_hd_chinese_jungle_geranium_710.glb",
  //   label: "jungle BUSH",
  //   position: [P.PLANT_BUSH_C_X, P.PLANT_BUSH_Y, P.PLANT_BUSH_C_Z],
  //   scale: [
  //     P.PLANT_BUSH_C_SCALE * 1.2,
  //     P.PLANT_BUSH_C_SCALE,
  //     P.PLANT_BUSH_C_SCALE * 1.3,
  //   ],
  //   rotationY: P.PLANT_BUSH_C_ANGLE,
  // },
  // {
  //   path: "models_optimized/realistic_hd_chinese_jungle_geranium_710.glb",
  //   label: "jungle BUSH",
  //   position: [P.PLANT_BUSH_D_X, P.PLANT_BUSH_Y, P.PLANT_BUSH_D_Z],
  //   scale: [
  //     P.PLANT_BUSH_D_SCALE * 1.2,
  //     P.PLANT_BUSH_D_SCALE,
  //     P.PLANT_BUSH_D_SCALE * 1.3,
  //   ],
  //   rotationY: P.PLANT_BUSH_D_ANGLE,
  // },
  {
    path: "models/free_dyspis_lutescens_-_potted_palm.glb",
    label: "plant",
    position: [P.PLANT_X, P.PLANT_Y, P.PLANT_Z],
    scale: P.PLANT_SCALE,
  },
  // ── COMMENTED OUT FOR PERF TEST: misc ───────────────────────────────────────
  // {
  //   path: "models_optimized/jenson_sideboard_solid_oak.glb",
  //   label: "bookcase",
  //   position: [P.BOOKCASE_X, P.BOOKCASE_Y, P.BOOKCASE_Z],
  //   scale: [P.BOOKCASE_SCALE * 2.4, P.BOOKCASE_SCALE, P.BOOKCASE_SCALE * 1.5],
  //   rotationY: P.BOOKCASE_ANGLE,
  // },
  // {
  //   path: "models_optimized/fruit_basket.glb",
  //   label: "ORANGE_FLOWERS",
  //   position: [P.FRUITS_X, P.FRUITS_Y, P.FRUITS_Z],
  //   scale: P.FRUITS_SCALE,
  // },
  // {
  //   path: "models_optimized/teapot.glb",
  //   label: "ORANGE_FLOWERS",
  //   position: [P.TEA_X, P.TEA_Y, P.TEA_Z],
  //   scale: P.TEA_SCALE,
  //   rotationY: P.TEA_ANGLE,
  // },
  // {
  //   path: "models_optimized/nespresso_machine_2.glb",
  //   label: "ORANGE_FLOWERS",
  //   position: [P.COFFEE_X, P.COFFEE_Y, P.COFFEE_Z],
  //   scale: P.COFFEE_SCALE,
  // },
];

// ── Progressive Suspense tiers ────────────────────────────────────────────────
// Tier 1: models visible during intro orbit (mountain, structure, ground).
// Tier 2: near furniture visible right after intro completes.
// Tier 3: decorative plants/bushes far from camera — true lazy load (no preload).
const PRIMARY_LABELS = new Set([
  "Mountain Peak",
  "Glass Terrace",
  // "mud",
  // "wooden_fence a",
]);

const TERTIARY_LABELS = new Set([
  "jungle geranium",
  "jungle PALM",
  "jungle LUPINE",
  "jungle SNOWFLAKE",
  "jungle CROTON",
  "jungle SINENSIS",
  "jungle BUSH",
  "creeper",
  "square",
]);

export const SCENE_OBJECTS_PRIMARY = SCENE_OBJECTS.filter((obj) =>
  PRIMARY_LABELS.has(obj.label)
);

export const SCENE_OBJECTS_SECONDARY = SCENE_OBJECTS.filter(
  (obj) => !PRIMARY_LABELS.has(obj.label) && !TERTIARY_LABELS.has(obj.label)
);

export const SCENE_OBJECTS_TERTIARY = SCENE_OBJECTS.filter((obj) =>
  TERTIARY_LABELS.has(obj.label)
);

// ── Mobile-reduced lists ─────────────────────────────────────────────────────
// Thin out repeated decorative objects to cut ~40-60 MB on mobile devices.
function filterForMobile(objects: SceneObject[]): SceneObject[] {
  const labelCount = new Map<string, number>();
  return objects.filter((obj) => {
    const idx = labelCount.get(obj.label) ?? 0;
    labelCount.set(obj.label, idx + 1);
    return shouldKeepOnMobile(obj.label, idx);
  });
}

export const SCENE_OBJECTS_PRIMARY_MOBILE = filterForMobile(
  SCENE_OBJECTS_PRIMARY
);
export const SCENE_OBJECTS_SECONDARY_MOBILE = filterForMobile(
  SCENE_OBJECTS_SECONDARY
);
export const SCENE_OBJECTS_TERTIARY_MOBILE = filterForMobile(
  SCENE_OBJECTS_TERTIARY
);
