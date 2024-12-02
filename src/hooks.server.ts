import { SvelteKitAuth } from '@auth/sveltekit';
import Auth0 from '@auth/core/providers/auth0';
import { AUTH_AUTH0_ID, AUTH_AUTH0_SECRET, AUTH_AUTH0_ISSUER } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = SvelteKitAuth({
  providers: [
    Auth0({
      clientId: AUTH_AUTH0_ID,
      clientSecret: AUTH_AUTH0_SECRET,
      issuer: AUTH_AUTH0_ISSUER
    })
  ],
  secret: AUTH_AUTH0_SECRET,
  trustHost: true
});
