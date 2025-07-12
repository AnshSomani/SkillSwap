import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // --- Proxy for Development ---
    // This forwards any request from the frontend to the backend server
    // so you don't get CORS errors in development.
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // Your backend server URL
        changeOrigin: true,
      },
    },
  },
})
