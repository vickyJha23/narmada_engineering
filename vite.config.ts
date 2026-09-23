import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
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
})
