import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vite"

export default defineConfig({
  server: {
    port: 3000,
    origin: 'https://3000-taemon1337-mosaicpicker-48fdgagn6eh.ws-us117.gitpod.io',
  },
  plugins: [sveltekit()],
})
