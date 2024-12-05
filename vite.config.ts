import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "three/examples/jsm": path.join(
        __dirname,
        "node_modules/three/examples/jsm"
      ),
    },
  },
});
