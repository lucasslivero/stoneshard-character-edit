import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@shared': resolve('src/shared'),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    // Sandboxed preload scripts can't use ESM imports
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
        '@ui': resolve('src/renderer/src/ui'),
        '@shadcn': resolve('src/renderer/src/ui/components/ui'),
        '@app': resolve('src/renderer/src/app'),
        '@assets': resolve('src/renderer/src/assets'),
      },
    },
    plugins: [react()],
  },
});
