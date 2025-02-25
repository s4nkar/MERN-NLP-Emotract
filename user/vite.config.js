import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [tailwindcss(), react()],
  preview: {
   port: 5173,
   strictPort: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
   port: 5173,
   strictPort: true,
   host: '0.0.0.0',
  //  origin: "http://0.0.0.0:5173",
  },
 });
