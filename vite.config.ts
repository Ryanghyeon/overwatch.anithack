import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    // 청크 용량 경고 기준을 여유 있게 조정 (기본 500kB -> 1000kB)
    // firebase 라이브러리의 한계.. 기본 사이즈가 너무 큼
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // 무거운 외부 라이브러리(node_modules)들을 따로 분리
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 리액트 코어 및 라우터는 'react-vendor'로 묶기
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router-dom')
            ) {
              return 'react-vendor';
            }
            // 무거운 패키지(파이어베이스)는 따로 'firebase-vendor'로 격리
            if (id.includes('firebase') || id.includes('@firebase')) {
              return 'firebase-vendor';
            }
            // 나머지는 'vendor'로 묶기
            return 'vendor';
          }
        },
      },
    },
  },
});
