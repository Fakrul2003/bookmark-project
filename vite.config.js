// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // প্রোডাকশন মোড চেক (npm run build)
  const isProduction = mode === 'production';

  return {
    plugins: [react()],
    
    // লোকালে: '/' | GitHub Pages-এ: '/bookmark-project/'
    base: isProduction ? '/bookmark-project/' : '/',

    server: {
      port: 5173,
      open: true, // স্বয়ংক্রিয় ব্রাউজার ওপেন
      host: true  // 0.0.0.0 (যদি নেটওয়ার্ক থেকে দেখতে হয়)
    },

    build: {
      outDir: 'dist',
      sourcemap: true
    }
  };
});