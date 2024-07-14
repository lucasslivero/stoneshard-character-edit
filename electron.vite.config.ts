import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        output: {
          format: 'cjs',
        },
      },
    },
  },
  renderer: {
    resolve: {
      alias: {
        '@shared': resolve('src/shared'),
        '@renderer': resolve('src/renderer/src'),
        '@ui': resolve('src/renderer/src/ui'),
        '@shadcn': resolve('src/renderer/src/ui/components/ui'),
        '@app': resolve('src/renderer/src/app'),
        '@assets': resolve('src/renderer/src/assets'),
      },
    },
    plugins: [react()],
  },
});
