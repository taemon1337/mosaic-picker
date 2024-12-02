/// <reference types="@auth/sveltekit" />
declare global {
	namespace App {
		interface Locals {
			getSession(): Promise<import('@auth/core').Session | null>
		}
		interface PageData {
			session: import('@auth/core').Session | null
		}
	}
}

export {};
