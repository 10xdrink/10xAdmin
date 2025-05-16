// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Force project root to current directory
process.env.VITE_CWD = process.cwd();

// Create dummy files in project root to prevent looking up
const rootDir = path.resolve(process.cwd());
const createEmptyJSON = (filename) => {
  // Check if file doesn't exist and create it
  const filePath = path.join(rootDir, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '{}', 'utf-8');
  }
};

// Create dummy package.json and tsconfig.json in project root if they don't exist
createEmptyJSON('./package.json');
createEmptyJSON('./tsconfig.json');

export default defineConfig({
  plugins: [react()],
  // Force root to current directory
  root: process.cwd(),
  // Explicitly specify config file to use
  configFile: path.resolve(process.cwd(), 'vite.config.js'),
  // Don't search parent directories
  envDir: process.cwd(),
  server: {
    port: 5174,
    proxy: {
      // Primary API proxy configuration with more specific path
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxy request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Proxy response:', proxyRes.statusCode, req.url);
          });
        }
      },
      // Direct product endpoints
      '/api/products': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      // Direct category endpoints
      '/api/categories': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      // Direct order endpoints
      '/api/orders': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      // Direct user endpoints
      '/api/users': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      // Direct auth endpoints
      '/api/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      // Direct blog endpoints
      '/api/blogs': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      // Direct coupon endpoints
      '/api/coupons': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    },
  },
  build: {
    outDir: 'dist',
  },
});

