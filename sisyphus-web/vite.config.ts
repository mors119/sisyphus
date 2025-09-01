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
        secure: false, // 설정하면 프록시가 연결 가능 (배포 시 true 변경 또는 제거) TODO: true로 변경 또는 제거
        // rewrite: (path) => path.replace(/^\/api/, '/api'), // 경로 유지
      },
      '/uploads': {
        target: 'http://localhost:8080', // 백엔드 주소 TODO: 서버주소로 변경
        changeOrigin: true,
        secure: false, // 설정하면 프록시가 연결 가능 (배포 시 true 변경 또는 제거) TODO: true로 변경 또는 제거
      },
    },
  },
});
