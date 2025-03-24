import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Increase the warning limit if you're comfortable with the bundle size
    chunkSizeWarningLimit: 700,

    // Configure Rollup options for better code splitting
    rollupOptions: {
      output: {
        // Create separate chunks for large dependencies
        manualChunks: {
          // React and related libraries
          "react-vendor": ["react", "react-dom", "react-router-dom"],

          // Redux and related libraries
          "redux-vendor": ["react-redux", "redux", "@reduxjs/toolkit"],

        },
      },
    },
  },
});
