import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // The 'plugins' array is where you add Vite plugins.
  // '@vitejs/plugin-react' enables React support, including Fast Refresh (HMR).
  plugins: [react()],
  
  // The 'server' object allows you to configure the development server.
  server: {
    // You can specify the port for the development server.
    // Vite will automatically find another port if 3000 is already in use.
    port: 3000 
  }
})
