import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Use this configuration to resolve the TS2307 error by allowing .ts extension in JSX/TSX
      // Without this, when importing files like `../../store/authSlice.ts`, Vite throws an error.
      exclude: [/\.ts$/]
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});