import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    // Set default API URL for production builds
    "import.meta.env.VITE_API_URL": JSON.stringify(
      process.env.VITE_API_URL ||
        "https://monkfish-app-nnhdy.ondigitalocean.app/api"
    ),
  },
});
