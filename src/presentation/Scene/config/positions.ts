// ─── Scene object positions ──────────────────────────────────────────────────
// All spatial constants for 3D objects in the scene.

export const MOUNTAIN_SCALE = 80;
export const MOUNTAIN_Y = -50;
export const PEAK_WORLD_Y = MOUNTAIN_Y + 0.23 * MOUNTAIN_SCALE;

export const TERRACE_X = -5;
export const TERRACE_Y = PEAK_WORLD_Y - 0.5;
export const TERRACE_Z = -8;

export const PERGOLA_X = 8;
export const PERGOLA_Y = PEAK_WORLD_Y - 11;
export const PERGOLA_Z = -15;
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

export const SHELF_X = TERRACE_X + 9.5;
export const SHELF_Y = TERRACE_Y - 2.7;
export const SHELF_Z = TERRACE_Z - 4;
export const SHELF_SCALE = 1.8;

export const FRUITS_X = SHELF_X + 1.2;
export const FRUITS_Y = SHELF_Y + 0.83;
export const FRUITS_Z = SHELF_Z;
export const FRUITS_SCALE = 1.7;

export const TEA_X = SHELF_X - 0.1;
export const TEA_Y = SHELF_Y + 0.85;
export const TEA_Z = SHELF_Z;
export const TEA_SCALE = 1.4;
export const TEA_ANGLE = Math.PI / 2;

export const COFFEE_X = SHELF_X - 1;
export const COFFEE_Y = SHELF_Y + 0.8;
export const COFFEE_Z = SHELF_Z;
export const COFFEE_SCALE = 35;

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

export const DESK_X = PERGOLA_X + 1.85;
export const DESK_Y = PERGOLA_Y + 7.8;
export const DESK_Z = PERGOLA_Z + 3.5;
export const DESK_SCALE = 0.015;

export const MUG_X = DESK_X + 2;
export const MUG_Y = DESK_Y + 0.98;
export const MUG_Z = DESK_Z + 0.25;
export const MUG_SCALE = 0.02;
export const MUG_ANGLE = Math.PI * 1.9;

export const COASTER_X = MUG_X - 0.28;
export const COASTER_Y = MUG_Y;
export const COASTER_Z = MUG_Z - 0.1;
export const COASTER_SCALE = 0.15;
export const COASTER_ANGLE = Math.PI * 0.8;

export const MONITOR_A_X = DESK_X - 3.47;
export const MONITOR_A_Y = DESK_Y + 0.62;
export const MONITOR_A_Z = DESK_Z + 0.4;
export const MONITOR_A_ANGLE = Math.PI * 0.08;

export const MONITOR_B_X = DESK_X - 2.7;
export const MONITOR_B_Y = DESK_Y + 0.62;
export const MONITOR_B_Z = DESK_Z - 0.5;
export const MONITOR_B_ANGLE = 0;

export const MONITOR_C_X = DESK_X - 1.67;
export const MONITOR_C_Y = DESK_Y + 0.62;
export const MONITOR_C_Z = DESK_Z - 1.35;
export const MONITOR_C_ANGLE = -Math.PI * 0.1;

export const KEYBOARD_X = DESK_X;
export const KEYBOARD_Y = DESK_Y + 0.98;
export const KEYBOARD_Z = DESK_Z + 0.5;

export const PAD_X = DESK_X;
export const PAD_Y = DESK_Y - 1.1;
export const PAD_Z = DESK_Z - 0.6;
export const PAD_SCALE = 0.4;
export const PAD_ANGLE = Math.PI * 1.5;

export const LAPTOP_X = DESK_X - 1;
export const LAPTOP_Y = DESK_Y + 1;
export const LAPTOP_Z = DESK_Z;

export const DESK_LAMP_X = DESK_X - 1.5;
export const DESK_LAMP_Y = DESK_Y + 1.38;
export const DESK_LAMP_Z = DESK_Z - 0.4;
export const DESK_LAMP_SCALE = 0.8;
export const DESK_LAMP_ANGLE = -Math.PI * 1.5;

export const MOUSE_X = DESK_X + 0.6;
export const MOUSE_Y = DESK_Y + 0.98;
export const MOUSE_Z = DESK_Z + 0.3;

export const OFFICE_CHAIR_X = DESK_X;
export const OFFICE_CHAIR_Y = DESK_Y + 0.02;
export const OFFICE_CHAIR_Z = DESK_Z + 1.0;
export const OFFICE_CHAIR_SCALE = 0.015;

export const COFFEE_TABLE_X = PERGOLA_X - 8;
export const COFFEE_TABLE_Y = PERGOLA_Y + 7.8;
export const COFFEE_TABLE_Z = TERRACE_Z - 1;
export const COFFEE_TABLE_SCALE = 0.01;

export const TABLET_X = COFFEE_TABLE_X - 0.2;
export const TABLET_Y = COFFEE_TABLE_Y + 0.3;
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

export const ARMCHAIR_X = COFFEE_TABLE_X + 0.2;
export const ARMCHAIR_Y = COFFEE_TABLE_Y + 0.01;
export const ARMCHAIR_Z = COFFEE_TABLE_Z + 1.6;
export const ARMCHAIR_SCALE = 0.012;
export const ARMCHAIR_ANGLE = Math.PI;

export const SOFA_X = COFFEE_TABLE_X - 1.25;
export const SOFA_Y = COFFEE_TABLE_Y + 0.01;
export const SOFA_Z = COFFEE_TABLE_Z + 0.2;
export const SOFA_SCALE = 0.01;
export const SOFA_ANGLE = Math.PI / 2;

export const PILLOW_X = SOFA_X - 0.05;
export const PILLOW_Y = SOFA_Y + 0.1;
export const PILLOW_Z = SOFA_Z - 0.5;
export const PILLOW_SCALE = 0.0007;
export const PILLOW_ANGLE = Math.PI / 2.2;

export const RUG_MEETING_X = COFFEE_TABLE_X - 0.5;
export const RUG_MEETING_Y = COFFEE_TABLE_Y + 0.01;
export const RUG_MEETING_Z = COFFEE_TABLE_Z + 0.5;
export const RUG_MEETING_SCALE = 2.2;

export const RUG_OFFICE_X = DESK_X - 0.1;
export const RUG_OFFICE_Y = DESK_Y + 0.02;
export const RUG_OFFICE_Z = DESK_Z + 0.8;
export const RUG_OFFICE_SCALE = 2;
export const RUG_OFFICE_ANGLE = Math.PI / 2;

export const BOOKCASE_X = DESK_X + 2.1;
export const BOOKCASE_Y = DESK_Y;
export const BOOKCASE_Z = DESK_Z + 1.1;
export const BOOKCASE_SCALE = 0.01;
export const BOOKCASE_ANGLE = Math.PI * 1.5;
