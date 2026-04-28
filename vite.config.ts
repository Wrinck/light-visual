import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, 'src/core'),
      '@render': path.resolve(__dirname, 'src/render'),
      '@ui': path.resolve(__dirname, 'src/ui'),
      '@workers': path.resolve(__dirname, 'src/core/workers'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  worker: {
    format: 'es', // Критично для Web Workers с TypeScript
  },
});
