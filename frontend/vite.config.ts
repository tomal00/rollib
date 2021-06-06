import {defineConfig} from 'vite'
import path from 'path'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [preact()],
	resolve: {
		alias: {
			'@Types': path.resolve('./src/types'),
			'@Hooks': path.resolve('./src/hooks'),
			'@Components': path.resolve('./src/components'),
			'@Root': path.resolve('./src'),
		},
	},
	server: {
		hmr: {
			protocol: 'ws',
			host: 'localhost',
		},
	},
})
