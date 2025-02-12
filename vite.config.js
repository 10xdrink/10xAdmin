// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use Vite's environment variable prefix (`VITE_`) and provide a default value if undefined
const apiUrl = process.env.VITE_API_URL || 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        port: 5174,
        target: apiUrl,
        changeOrigin: true,
        secure: false,
        // Uncomment and modify if your backend API has a different base path
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
