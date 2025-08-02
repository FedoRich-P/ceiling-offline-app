import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/chunks/[name].[hash].js',
        assetFileNames: 'assets/[ext]/[name].[hash].[ext]',

        manualChunks: {
          react: ['react', 'react-dom'],
          konva: ['konva', 'react-konva'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          router: ['react-router']
        }
      }
    }
  },
})
