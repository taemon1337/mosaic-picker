import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@use "src/variables.scss" as *;'
			}
		}
	},
	optimizeDeps: {
		include: ['beercss', 'material-dynamic-colors']
	},
	server: {
		watch: {
			usePolling: true
		},
		host: true
	}
});
