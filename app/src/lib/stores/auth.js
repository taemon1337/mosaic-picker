import { readable, writable } from 'svelte/store';
import { env } from '$env/dynamic/public';

export const isLoggedIn = writable(false);
export const user = writable(null);
export const GOOGLE_CLIENT_ID = readable(env.PUBLIC_GOOGLE_CLIENT_ID);