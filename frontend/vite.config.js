import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/": "https://mern-e-commerce-v2s2.onrender.com",
      // "/api/": "http://localhost:5000",
    },
  },
});
