import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.VITE_PROXY_TARGET || 'http://localhost:8080'
  /** Si le backend n’a pas de préfixe /api (routes sous http://localhost:8080/auth/...), mets VITE_PROXY_STRIP_API_PREFIX=true */
  const stripApiPrefix = env.VITE_PROXY_STRIP_API_PREFIX === 'true'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          ...(stripApiPrefix
            ? { rewrite: (path) => path.replace(/^\/api/, '') || '/' }
            : {}),
        },
      },
    },
  }
})
