import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 백엔드 주소 TODO: 서버주소로 변경
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // 경로 유지
      },
    },
  },
});
