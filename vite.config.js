
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["buffer", "process"]
  },
  define: {
    'process.env': {}
  }
})
