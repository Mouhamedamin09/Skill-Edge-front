import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
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
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          motion: ["framer-motion"],
        },
      },
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
  },
  define: {
    // Only set API URL for production builds, let .env work for dev
    ...(mode === "production" && {
      "import.meta.env.VITE_API_URL": JSON.stringify(
        "https://monkfish-app-nnhdy.ondigitalocean.app/api"
      ),
    }),
  },
}));
