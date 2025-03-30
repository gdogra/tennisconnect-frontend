import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/challenges": "http://localhost:5000",
      "/players": "http://localhost:5000",
      "/users": "http://localhost:5000",
      "/register": "http://localhost:5000",
      "/login": "http://localhost:5000",
    },
  },
});

