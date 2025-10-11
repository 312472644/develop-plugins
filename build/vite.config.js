import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './index.js',
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['path', 'fs'],
    },
  },
});
