import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": "./src/components",
      "@hooks": "./src/hooks",
      "@utils": "./src/utils",
      "@styles": "./src/styles",
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
});
