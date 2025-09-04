import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/cruiseship-management-webapp/',
  plugins: [react()],
})