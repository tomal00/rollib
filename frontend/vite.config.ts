import {defineConfig} from 'vite'
import path from 'path'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [preact()],
	resolve: {
		alias: {
			'@Assets': path.resolve('./assets'),
			'@Types': path.resolve('./src/types'),
			'@Hooks': path.resolve('./src/hooks'),
			'@Components': path.resolve('./src/components'),
			'@Root': path.resolve('./src'),
			react: 'preact/compat',
			'react-dom/test-utils': 'preact/test-utils',
			'react-dom': 'preact/compat',
		},
	},
	server: {
		hmr: {
			protocol: 'ws',
			host: 'localhost',
		},
	},
})
