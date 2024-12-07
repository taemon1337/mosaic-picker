import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/core/providers/google';
import { AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_GOOGLE_SCOPES, AUTH_SECRET } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';
import type { JWT } from '@auth/core/jwt';

export const handle: Handle = SvelteKitAuth({
  debug: true,
  providers: [
    Google({
      clientId: AUTH_GOOGLE_ID,
      clientSecret: AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          scope: AUTH_GOOGLE_SCOPES,
          access_type: 'offline',
          prompt: 'consent',
          response_type: 'code',
          include_granted_scopes: 'true'
        }
      }
    })
  ],
  secret: AUTH_SECRET,
  trustHost: true,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account?.access_token) {
        console.error('No access token present after sign in');
        return false;
      }
      console.log('SignIn callback:', { 
        user: { id: user?.id, email: user?.email },
        account: { 
          provider: account?.provider,
          scope: account?.scope,
          hasAccessToken: !!account?.access_token
        }
      });
      return true;
    },
    async jwt({ token, account, profile }) {
      console.log('JWT callback - incoming data:', { 
        token: {
          sub: token?.sub,
          provider: token?.provider,
          hasAccessToken: !!token?.accessToken
        },
        account: account ? {
          provider: account.provider,
          scope: account.scope,
          hasAccessToken: !!account.access_token
        } : null
      });

      // Only update token on initial sign in or token refresh
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        token.scope = account.scope;
      }

      console.log('JWT callback - updated token:', { 
        hasAccessToken: !!token.accessToken,
        provider: token.provider,
        scope: token.scope
      });
      return token;
    },
    async session({ session, token }) {
      const typedToken = token as JWT & {
        provider?: string;
        accessToken?: string;
        scope?: string;
      };

      // Add token info to the session
      session.accessToken = typedToken.accessToken;
      session.provider = typedToken.provider;
      session.scope = typedToken.scope;

      console.log('Session callback:', { 
        provider: session.provider,
        hasAccessToken: !!session.accessToken,
        scope: session.scope
      });

      return session;
    }
  },
  logger: {
    error(code, metadata) {
      console.error(code, metadata);
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      console.debug(code, metadata);
    }
  }
});
