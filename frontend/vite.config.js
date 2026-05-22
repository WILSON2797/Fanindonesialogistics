import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    {
      name: 'admin-rewrite-plugin',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url.split('?')[0];
          if (url === '/admin' || url === '/admin/') {
            req.url = '/admin/index.html';
          }
          next();
        });
      }
    }
  ],
  base: command === 'build' ? './' : '/', // Use '/' for dev (fixes trailing slash issues), and './' for production (relative paths)
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin/index.html')
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost/website_version_vue',
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: 'http://localhost/website_version_vue',
        changeOrigin: true,
        secure: false
      }
    }
  }
}));
