import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server :{allowedHosts: ["311c-37-111-217-105.ngrok-free.app","418f-37-111-217-105.ngrok-free.app"]}
})
