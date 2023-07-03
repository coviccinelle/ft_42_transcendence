import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
	port: 8081,
	hmr: {
		port: 8082,
		clientPort: 8080,
		path: '/__vite_hmr',
	},
  }
})
