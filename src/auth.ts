import { SvelteKitAuth } from "@auth/sveltekit"
import Auth0 from "@auth/sveltekit/providers/auth0"
import { AUTH_AUTH0_ID, AUTH_AUTH0_SECRET, AUTH_AUTH0_ISSUER } from "$env/static/private"

export const { handle, signIn, signOut } = SvelteKitAuth({
  trustHost: true,
  providers: [
    Auth0({
      clientId: AUTH_AUTH0_ID,
      clientSecret: AUTH_AUTH0_SECRET,
      issuer: AUTH_AUTH0_ISSUER,
    })
  ]
})
