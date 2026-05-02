import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: { exportType: "named", ref: true },
      include: "**/*.svg",
    }),
    react(),
  ],
  base: "/mountain/",
});
