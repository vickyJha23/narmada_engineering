import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/**
 * Adds the Google Search Console / Bing Webmaster ownership tags to <head>
 * when their codes are set in .env. The prerender step copies them to every page.
 */
function siteVerification(env: Record<string, string>): Plugin {
  const tags = [
    ['google-site-verification', env.VITE_GOOGLE_SITE_VERIFICATION],
    ['msvalidate.01', env.VITE_BING_SITE_VERIFICATION],
  ]
    .filter(([, code]) => code?.trim())
    .map(([name, code]) => ({
      tag: 'meta',
      attrs: { name, content: code.trim() },
      injectTo: 'head' as const,
    }))

  return { name: 'site-verification', transformIndexHtml: () => tags }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    siteVerification(loadEnv(mode, process.cwd(), 'VITE_')),
  ],
  build: {
    target: 'es2020',
    cssTarget: 'chrome80',
    assetsInlineLimit: 2048,
    reportCompressedSize: false,
  },
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 4173,
  },
}))
