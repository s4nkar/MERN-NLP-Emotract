import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
   port: 5174,
   strictPort: true,
  },
  server: {
   port: 5174,
   strictPort: true,
   host: '0.0.0.0',
  //  origin: "http://0.0.0.0:5174",
  },
 });

