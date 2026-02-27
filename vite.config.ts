import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/NyxGrid/',
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 800,
  },
})
