import { defineConfig } from 'vite';
import { CopyDest } from '@develop-plugins/build';

export default defineConfig({
  plugins: [
    CopyDest({
      list: [{ target: './index.d.ts', source: './dist' }],
    }),
  ],
  build: {
    lib: {
      entry: './index.js',
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['child_process', 'path', 'fs'],
    },
  },
});
