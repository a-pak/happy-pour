import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on `mode`
  const env = loadEnv(mode, path.resolve(__dirname, '../'), '')
  return {
    // Vite configuration
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    envDir: path.resolve(__dirname, '../'),
    plugins: [
        react(),
    ],
  }
})