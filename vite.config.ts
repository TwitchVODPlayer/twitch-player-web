import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { fileURLToPath, URL } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL("./src", import.meta.url))
    },
  },
  plugins: [
    vue(),
    svgLoader({ defaultImport: 'component' })
  ]
})
