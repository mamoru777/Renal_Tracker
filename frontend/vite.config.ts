import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables for the current mode
  const env = loadEnv(mode, process.cwd(), '');

  // Convert the VITE_PORT string to a number
  const port = parseInt(env.VITE_PORT, 10) || 3000;

  return {
    build: {
      rollupOptions: {
        input: './index.html',
        output: {
          entryFileNames: '[name].[hash:8].js',
          format: 'esm',
        },
      },
    },
    css: {
      modules: {
        generateScopedName: '[name].[hash:8]',
        localsConvention: 'camelCase',
      },
    },
    plugins: [react()],
    server: {
      port,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
