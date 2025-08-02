import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
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
        // Настройка имени чанка (включая entry, dynamic imports и vendor chunks)
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/chunks/[name].[hash].js',
        assetFileNames: 'assets/[ext]/[name].[hash].[ext]',

        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Пример разбивки на конкретные крупные либы:
            if (id.includes('react')) {
              return 'vendor-react';
            }
            if (id.includes('lodash')) {
              return 'vendor-lodash';
            }
            if (id.includes('some-big-lib')) {
              return 'vendor-some-big-lib';
            }
            // Все остальное в общий вендор:
            return 'vendor';
          }

          // Разделение по папкам проекта, если нужно
          if (id.includes('src/components/')) {
            return 'components';
          }
          if (id.includes('src/utils/')) {
            return 'utils';
          }
        }
      }
    }
  }
})
