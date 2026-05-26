// ─── Scene object positions ──────────────────────────────────────────────────
// All spatial constants for 3D objects in the scene.

// export const MOUNTAIN_SCALE = 80;
// export const MOUNTAIN_Y = -50;
// export const PEAK_WORLD_Y = MOUNTAIN_Y + 0.23 * MOUNTAIN_SCALE;

export const MOUNTAIN_SCALE = 0.15;
export const MOUNTAIN_Y = -10;
export const PEAK_WORLD_Y = MOUNTAIN_Y + 0.23 * MOUNTAIN_SCALE;

export const PERGOLA_X = 8;
export const PERGOLA_Y = PEAK_WORLD_Y - 10;
export const PERGOLA_Z = 10;
export const PERGOLA_SCALE = 0.05;
export const PERGOLA_ANGLE = Math.PI;

export const BAR_TABLE_X = PERGOLA_X - 9.2;
export const BAR_TABLE_Y = PERGOLA_Y + 7.8;
export const BAR_TABLE_Z = PERGOLA_Z - 0.1;
export const BAR_TABLE_SCALE = 0.01;

export const PLANT_MONEY_X = BAR_TABLE_X;
export const PLANT_MONEY_Y = BAR_TABLE_Y + 0.95;
export const PLANT_MONEY_Z = BAR_TABLE_Z;
export const PLANT_MONEY_SCALE = 0.5;

export const BAR_CHAIR_FIRST_X = BAR_TABLE_X;
export const BAR_CHAIR_FIRST_Y = BAR_TABLE_Y;
export const BAR_CHAIR_FIRST_Z = BAR_TABLE_Z + 0.5;
export const BAR_CHAIR_FIRST_SCALE = 0.01;
export const BAR_CHAIR_FIRST_ANGLE = Math.PI;

export const BAR_CHAIR_SECOND_X = BAR_TABLE_X - 0.5;
export const BAR_CHAIR_SECOND_Y = BAR_TABLE_Y;
export const BAR_CHAIR_SECOND_Z = BAR_TABLE_Z;
export const BAR_CHAIR_SECOND_SCALE = 0.01;
export const BAR_CHAIR_SECOND_ANGLE = Math.PI / 2;

export const MUD_X = PERGOLA_X - 4;
export const MUD_Y = PERGOLA_Y + 7.82;
export const MUD_Z = PERGOLA_Z + 10.5;
export const MUD_SCALE = 0.01;

export const WOODEN_FENCE_A_X = MUD_X + 7.25;
export const WOODEN_FENCE_B_X = MUD_X + 4;
export const WOODEN_FENCE_C_X = MUD_X + 0.75;
export const WOODEN_FENCE_D_X = MUD_X - 2.25;
export const WOODEN_FENCE_E_X = MUD_X - 5.4;
export const WOODEN_FENCE_Y = MUD_Y;
export const WOODEN_FENCE_Z = MUD_Z - 1.5;
export const WOODEN_FENCE_SCALE = 0.5;
export const WOODEN_FENCE_ANGLE = -Math.PI / 2;

export const PLANT_GERANIUM_A_X = MUD_X + 4;
export const PLANT_GERANIUM_B_X = MUD_X - 1;
export const PLANT_GERANIUM_C_X = MUD_X - 4.7;
export const PLANT_GERANIUM_D_X = MUD_X + 1.3;
export const PLANT_GERANIUM_E_X = MUD_X + 7;
export const PLANT_GERANIUM_Y = MUD_Y;
export const PLANT_GERANIUM_A_Z = MUD_Z - 1.1;
export const PLANT_GERANIUM_B_Z = MUD_Z - 1.2;
export const PLANT_GERANIUM_C_Z = MUD_Z - 0.7;
export const PLANT_GERANIUM_D_Z = MUD_Z - 0.6;
export const PLANT_GERANIUM_E_Z = MUD_Z - 0.55;
export const PLANT_GERANIUM_SCALE = 0.8;
export const PLANT_GERANIUM_C_SCALE = 1;
export const PLANT_GERANIUM_A_ANGLE = Math.PI * 1.5;
export const PLANT_GERANIUM_B_ANGLE = Math.PI;
export const PLANT_GERANIUM_C_ANGLE = -Math.PI;
export const PLANT_GERANIUM_D_ANGLE = Math.PI * 1.1;
export const PLANT_GERANIUM_E_ANGLE = -Math.PI * 0.9;

export const PLANT_PALM_A_X = MUD_X + 2.5;
export const PLANT_PALM_B_X = MUD_X - 1;
export const PLANT_PALM_Y = MUD_Y;
export const PLANT_PALM_A_Z = MUD_Z + 0.2;
export const PLANT_PALM_B_Z = MUD_Z - 0.2;
export const PLANT_PALM_A_SCALE = 2;
export const PLANT_PALM_B_SCALE = 1.6;
export const PLANT_PALM_A_ANGLE = Math.PI * 1.5;
export const PLANT_PALM_B_ANGLE = Math.PI;

export const PLANT_LUPINE_A_X = MUD_X + 6;
export const PLANT_LUPINE_B_X = MUD_X - 3.5;
export const PLANT_LUPINE_C_X = MUD_X + 8.5;
export const PLANT_LUPINE_D_X = MUD_X + 2;
export const PLANT_LUPINE_Y = MUD_Y;
export const PLANT_LUPINE_A_Z = MUD_Z - 1;
export const PLANT_LUPINE_B_Z = MUD_Z - 0.9;
export const PLANT_LUPINE_C_Z = MUD_Z - 0.4;
export const PLANT_LUPINE_D_Z = MUD_Z - 0.4;
export const PLANT_LUPINE_A_SCALE = 1;
export const PLANT_LUPINE_B_SCALE = 0.8;
export const PLANT_LUPINE_C_SCALE = 0.95;
export const PLANT_LUPINE_D_SCALE = 0.85;
export const PLANT_LUPINE_A_ANGLE = Math.PI * 1.5;
export const PLANT_LUPINE_B_ANGLE = Math.PI;
export const PLANT_LUPINE_C_ANGLE = Math.PI * 1.6;
export const PLANT_LUPINE_D_ANGLE = Math.PI * 0.9;

export const PLANT_SNOWFLAKE_A_X = MUD_X + 5;
export const PLANT_SNOWFLAKE_B_X = MUD_X;
export const PLANT_SNOWFLAKE_C_X = MUD_X + 5.3;
export const PLANT_SNOWFLAKE_D_X = MUD_X - 0.4;
export const PLANT_SNOWFLAKE_Y = MUD_Y;
export const PLANT_SNOWFLAKE_A_Z = MUD_Z - 1;
export const PLANT_SNOWFLAKE_B_Z = MUD_Z - 0.7;
export const PLANT_SNOWFLAKE_C_Z = MUD_Z - 0.15;
export const PLANT_SNOWFLAKE_D_Z = MUD_Z - 0.1;
export const PLANT_SNOWFLAKE_A_SCALE = 0.6;
export const PLANT_SNOWFLAKE_B_SCALE = 0.7;
export const PLANT_SNOWFLAKE_C_SCALE = 0.65;
export const PLANT_SNOWFLAKE_D_SCALE = 0.75;
export const PLANT_SNOWFLAKE_A_ANGLE = Math.PI * 1.5;
export const PLANT_SNOWFLAKE_B_ANGLE = Math.PI;
export const PLANT_SNOWFLAKE_C_ANGLE = Math.PI * 1.4;
export const PLANT_SNOWFLAKE_D_ANGLE = Math.PI * 1.1;

export const PLANT_CROTON_A_X = MUD_X + 8;
export const PLANT_CROTON_B_X = MUD_X - 5.5;
export const PLANT_CROTON_C_X = MUD_X + 3;
export const PLANT_CROTON_D_X = MUD_X + 1.5;
export const PLANT_CROTON_Y = MUD_Y;
export const PLANT_CROTON_A_Z = MUD_Z - 1.15;
export const PLANT_CROTON_B_Z = MUD_Z - 1.2;
export const PLANT_CROTON_C_Z = MUD_Z - 0.35;
export const PLANT_CROTON_D_Z = MUD_Z - 1.1;
export const PLANT_CROTON_A_SCALE = 0.25;
export const PLANT_CROTON_B_SCALE = 0.22;
export const PLANT_CROTON_C_SCALE = 0.24;
export const PLANT_CROTON_D_SCALE = 0.28;
export const PLANT_CROTON_A_ANGLE = Math.PI * 1.5;
export const PLANT_CROTON_B_ANGLE = -Math.PI * 1.5;
export const PLANT_CROTON_C_ANGLE = Math.PI * 1.85;
export const PLANT_CROTON_D_ANGLE = Math.PI / 2;

export const PLANT_SINENSIS_A_X = MUD_X - 2.5;
export const PLANT_SINENSIS_B_X = MUD_X - 6.5;
export const PLANT_SINENSIS_Y = MUD_Y - 1.6;
export const PLANT_SINENSIS_A_Z = MUD_Z - 0.6;
export const PLANT_SINENSIS_B_Z = MUD_Z - 0.6;
export const PLANT_SINENSIS_A_SCALE = 1.4;
export const PLANT_SINENSIS_B_SCALE = 1.2;
export const PLANT_SINENSIS_A_ANGLE = 0;
export const PLANT_SINENSIS_B_ANGLE = Math.PI;

export const PLANT_BUSH_A_X = MUD_X + 8;
export const PLANT_BUSH_B_X = MUD_X + 6;
export const PLANT_BUSH_C_X = MUD_X + 4;
export const PLANT_BUSH_D_X = MUD_X + 1;
export const PLANT_BUSH_Y = MUD_Y;
export const PLANT_BUSH_A_Z = MUD_Z + 0.5;
export const PLANT_BUSH_B_Z = MUD_Z + 0.5;
export const PLANT_BUSH_C_Z = MUD_Z + 0.35;
export const PLANT_BUSH_D_Z = MUD_Z + 0.35;
export const PLANT_BUSH_A_SCALE = 1.7;
export const PLANT_BUSH_B_SCALE = 1.8;
export const PLANT_BUSH_C_SCALE = 1.6;
export const PLANT_BUSH_D_SCALE = 1.6;
export const PLANT_BUSH_A_ANGLE = Math.PI * 1.5;
export const PLANT_BUSH_B_ANGLE = -Math.PI * 1.5;
export const PLANT_BUSH_C_ANGLE = Math.PI * 1.75;
export const PLANT_BUSH_D_ANGLE = Math.PI * 1.85;

export const DESK_X = PERGOLA_X - 13.82;
export const DESK_Y = PERGOLA_Y + 1;
export const DESK_Z = PERGOLA_Z + 4.05;
export const DESK_SCALE = 1.75;

export const SHELF_X = PERGOLA_X - 14.4;
export const SHELF_Y = PERGOLA_Y + 2;
export const SHELF_Z = PERGOLA_Z + 6.7;
export const SHELF_SCALE = 0.7;

// CENTRAL MONITOR (relative to desk)
export const MONITOR_B_SCALE = 1.65;
export const MONITOR_B_X = DESK_X - 0.5;
export const MONITOR_B_Y = DESK_Y - 0.45;
export const MONITOR_B_Z = DESK_Z + 3;
export const MONITOR_B_ANGLE = Math.PI * 0.5;

// LEFT MONITOR
export const MONITOR_A_SCALE = 1.65;
export const MONITOR_A_X = MONITOR_B_X + 1.23;
export const MONITOR_A_Y = MONITOR_B_Y;
export const MONITOR_A_Z = MONITOR_B_Z + 1.05;
export const MONITOR_A_ANGLE = MONITOR_B_ANGLE + Math.PI * 0.08;

// RIGHT MONITOR
export const MONITOR_C_SCALE = 1.65;
export const MONITOR_C_X = MONITOR_B_X - 1.16;
export const MONITOR_C_Y = MONITOR_B_Y;
export const MONITOR_C_Z = MONITOR_B_Z - 1.4;
export const MONITOR_C_ANGLE = MONITOR_B_ANGLE - Math.PI * 0.1;

export const KEYBOARD_X = DESK_X + 0.6;
export const KEYBOARD_Y = DESK_Y + 0.05;
export const KEYBOARD_Z = DESK_Z - 0.8;
export const KEYBOARD_SCALE = 0.01;
export const KEYBOARD_ANGLE = Math.PI * -1.5;

export const PAD_X = DESK_X;
export const PAD_Y = DESK_Y - 1.1;
export const PAD_Z = DESK_Z - 0.6;
export const PAD_SCALE = 0.4;
export const PAD_ANGLE = Math.PI * 1.5;

export const LAPTOP_X = DESK_X + 0.2;
export const LAPTOP_Y = DESK_Y + 0.05;
export const LAPTOP_Z = DESK_Z + 0.4;
export const LAPTOP_SCALE = 2;
export const LAPTOP_ANGLE = Math.PI * 1.5;

export const DESK_LAMP_X = DESK_X - 0.1;
export const DESK_LAMP_Y = DESK_Y + 0.45;
export const DESK_LAMP_Z = DESK_Z + 1;
export const DESK_LAMP_SCALE = 0.8;
export const DESK_LAMP_ANGLE = Math.PI;

export const MOUSE_X = DESK_X + 0.3;
export const MOUSE_Y = DESK_Y + 0.05;
export const MOUSE_Z = DESK_Z - 1.6;
export const MOUSE_SCALE = 1.6;
export const MOUSE_ANGLE = Math.PI * 1.5;

export const MUG_X = DESK_X + 0.3;
export const MUG_Y = DESK_Y + 0.05;
export const MUG_Z = DESK_Z - 2.6;
export const MUG_SCALE = 0.02;
export const MUG_ANGLE = -Math.PI * 1.5;

export const COASTER_X = MUG_X - 0.28;
export const COASTER_Y = MUG_Y;
export const COASTER_Z = MUG_Z - 0.1;
export const COASTER_SCALE = 0.15;
export const COASTER_ANGLE = Math.PI * 0.8;

export const OFFICE_CHAIR_X = DESK_X + 1.4;
export const OFFICE_CHAIR_Y = DESK_Y - 1;
export const OFFICE_CHAIR_Z = DESK_Z - 1;
export const OFFICE_CHAIR_SCALE = 0.015;
export const OFFICE_CHAIR_ANGLE = Math.PI * 1.6;

export const PLANT_X = PERGOLA_X - 1;
export const PLANT_Y = PERGOLA_Y + 0.01;
export const PLANT_Z = PERGOLA_Z + 1;
export const PLANT_SCALE = 1.5;

export const COFFEE_TABLE_X = PERGOLA_X - 4;
export const COFFEE_TABLE_Y = PERGOLA_Y + 0.01;
export const COFFEE_TABLE_Z = PERGOLA_Z + 4;
export const COFFEE_TABLE_SCALE = 2;

export const TABLET_X = COFFEE_TABLE_X - 0.2;
export const TABLET_Y = COFFEE_TABLE_Y + 0.8;
export const TABLET_Z = COFFEE_TABLE_Z + 0.2;
export const TABLET_SCALE = 1.5;
export const TABLET_ANGLE = Math.PI * 1.5;

export const TV_X = PERGOLA_X - 7.75;
export const TV_Y = PERGOLA_Y + 8.2;
export const TV_Z = PERGOLA_Z + 3.4;
export const TV_SCALE = 0.8;
export const TV_ANGLE = Math.PI * 2;

export const TV_CODE_X = TV_X - 0.02;
export const TV_CODE_Y = TV_Y + 0.7;
export const TV_CODE_Z = TV_Z + 0.01;
export const TV_CODE_SCALE = 1;
export const TV_CODE_ANGLE = Math.PI * 2;

export const PLANT_SQUARE_X = PERGOLA_X - 8;
export const PLANT_SQUARE_Y = PERGOLA_Y + 7.5;
export const PLANT_SQUARE_Z = PERGOLA_Z + 2.7;
export const PLANT_SQUARE_SCALE = 0.1;
export const PLANT_SQUARE_ANGLE = Math.PI * 1.5;

export const PLANT_SQUARE_B_X = PERGOLA_X - 11;
export const PLANT_SQUARE_B_Z = PERGOLA_Z + 8.1;
export const PLANT_SQUARE_B_ANGLE = Math.PI;

export const PLANT_SQUARE_C_X = PERGOLA_X - 8.8;
export const PLANT_SQUARE_C_Z = PERGOLA_Z + 10;
export const PLANT_SQUARE_C_ANGLE = Math.PI * 1.5;

export const PLANT_CREEPER_LEFT_X = PERGOLA_X - 11;
export const PLANT_CREEPER_LEFT_Y = PERGOLA_Y + 7.9;
export const PLANT_CREEPER_LEFT_Z = PERGOLA_Z + 0.2;
export const PLANT_CREEPER_LEFT_SCALE = 0.00007;
export const PLANT_CREEPER_LEFT_ANGLE = -Math.PI * 1.5;

export const PLANT_CREEPER_RIGHT_X = PERGOLA_X - 11;
export const PLANT_CREEPER_RIGHT_Y = PERGOLA_Y + 7.6;
export const PLANT_CREEPER_RIGHT_Z = PERGOLA_Z + 1.5;
export const PLANT_CREEPER_RIGHT_SCALE = 0.00007;
export const PLANT_CREEPER_RIGHT_ANGLE = Math.PI * 1.4;

export const FLOOR_LAMP_X = COFFEE_TABLE_X - 1;
export const FLOOR_LAMP_Y = COFFEE_TABLE_Y + 0.01;
export const FLOOR_LAMP_Z = COFFEE_TABLE_Z + 1.8;
export const FLOOR_LAMP_SCALE = 0.01;
export const FLOOR_LAMP_ANGLE = Math.PI;

const ARMCHAIR_RADIUS = 1.5;
const ARMCHAIR_Y = COFFEE_TABLE_Y + 0.01;
const ARMCHAIR_SCALE = 0.0175;

// A
export const ARMCHAIR_A_X =
  COFFEE_TABLE_X + Math.cos(Math.PI * 0.1) * ARMCHAIR_RADIUS;
export const ARMCHAIR_A_Y = ARMCHAIR_Y;
export const ARMCHAIR_A_Z =
  COFFEE_TABLE_Z + Math.sin(Math.PI * 0.1) * ARMCHAIR_RADIUS;
export const ARMCHAIR_A_SCALE = ARMCHAIR_SCALE;
export const ARMCHAIR_A_ANGLE = Math.PI * 1.4;

// B
export const ARMCHAIR_B_X =
  COFFEE_TABLE_X + Math.cos(Math.PI * 0.5) * ARMCHAIR_RADIUS;
export const ARMCHAIR_B_Y = ARMCHAIR_Y;
export const ARMCHAIR_B_Z =
  COFFEE_TABLE_Z + Math.sin(Math.PI * 0.5) * ARMCHAIR_RADIUS;
export const ARMCHAIR_B_SCALE = ARMCHAIR_SCALE;
export const ARMCHAIR_B_ANGLE = Math.PI * 1;

// C
export const ARMCHAIR_C_X =
  COFFEE_TABLE_X + Math.cos(Math.PI * 0.9) * ARMCHAIR_RADIUS;
export const ARMCHAIR_C_Y = ARMCHAIR_Y;
export const ARMCHAIR_C_Z =
  COFFEE_TABLE_Z + Math.sin(Math.PI * 0.9) * ARMCHAIR_RADIUS;
export const ARMCHAIR_C_SCALE = ARMCHAIR_SCALE;
export const ARMCHAIR_C_ANGLE = Math.PI * 0.6;

// D
export const ARMCHAIR_D_X =
  COFFEE_TABLE_X + Math.cos(Math.PI * 1.3) * ARMCHAIR_RADIUS;
export const ARMCHAIR_D_Y = ARMCHAIR_Y;
export const ARMCHAIR_D_Z =
  COFFEE_TABLE_Z + Math.sin(Math.PI * 1.3) * ARMCHAIR_RADIUS;
export const ARMCHAIR_D_SCALE = ARMCHAIR_SCALE;
export const ARMCHAIR_D_ANGLE = Math.PI * 0.2;

// E
export const ARMCHAIR_E_X =
  COFFEE_TABLE_X + Math.cos(Math.PI * 1.7) * ARMCHAIR_RADIUS;
export const ARMCHAIR_E_Y = ARMCHAIR_Y;
export const ARMCHAIR_E_Z =
  COFFEE_TABLE_Z + Math.sin(Math.PI * 1.7) * ARMCHAIR_RADIUS;
export const ARMCHAIR_E_SCALE = ARMCHAIR_SCALE;
export const ARMCHAIR_E_ANGLE = Math.PI * 1.8;

export const RUG_MEETING_X = COFFEE_TABLE_X;
export const RUG_MEETING_Y = COFFEE_TABLE_Y + 0.01;
export const RUG_MEETING_Z = COFFEE_TABLE_Z;
export const RUG_MEETING_SCALE = 2.2;

export const BOOKCASE_X = DESK_X + 2.1;
export const BOOKCASE_Y = DESK_Y;
export const BOOKCASE_Z = DESK_Z + 1.1;
export const BOOKCASE_SCALE = 0.01;
export const BOOKCASE_ANGLE = Math.PI * 1.5;
