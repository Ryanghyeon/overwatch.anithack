import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: '/src' }
    ]
  },
  // 청크 분할 최적화 세팅
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 남의 코드(node_modules)를 발견하면 가방을 따로
          if (id.includes('node_modules')) {
            // 1. 엄청나게 무거운 파이어베이스는 전용 가방에!
            if (id.includes('firebase')) return 'vendor-firebase';
            // 2. 리액트 관련 코드 전용 가방에
            if (id.includes('react')) return 'vendor-react';
            // 3. 기타 잡다한 남의 코드는 일반 가방에
            return 'vendor';
          }
        }
      }
    }
  }
})