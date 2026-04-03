import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const proxyTarget = env.VITE_BACKEND_PROXY_TARGET

  return {
    plugins: [react()],
    server: {
      proxy: proxyTarget
        ? {
            '/api': {
              target: proxyTarget,
              changeOrigin: true,
            },
            '/uploads': {
              target: proxyTarget,
              changeOrigin: true,
            },
          }
        : undefined,
    },
  }
})
