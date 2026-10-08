import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const DEFAULT_SITE_URL = 'https://gym-three-smoky.vercel.app'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = env.VITE_SITE_URL || DEFAULT_SITE_URL

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'html-site-url-transform',
        transformIndexHtml(html) {
          return html.replace(/%VITE_SITE_URL%/g, siteUrl)
        },
      },
    ],
  }
})


