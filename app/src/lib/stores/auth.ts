import { writable, get } from 'svelte/store';
import { env } from '$env/dynamic/public';
import { jwtVerify, jwtDecrypt, createRemoteJWKSet } from 'jose'

const SCOPES = env.PUBLIC_GOOGLE_SCOPES || 'https://www.googleapis.com/auth/drive.metadata.readonly'; // scopes required by API, separated by spaces
const CLIENT_ID = env.PUBLIC_GOOGLE_CLIENT_ID; // client ID from console.developers.google.com
const API_KEY = env.PUBLIC_GOOGLE_API_KEY; // API key from console.developers.google.com
const APP_ID = env.PUBLIC_GOOGLE_APP_ID; // project number from console.developers.google.com
const DISCOVERY_DOCS = [env.PUBLIC_GOOGLE_DISCOVERY_DOCS || 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const GOOGLE_JWK_URL = env.GOOGLE_JWK_URL || 'https://www.googleapis.com/oauth2/v3/certs';
const GOOGLE_JWK_ISSUER = env.GOOGLE_JWK_ISSUER || 'https://accounts.google.com';
const LOCALSTORAGE_USER_KEY = env.LOCALSTORAGE_USER_KEY || 'user';

// Example interface for user data (if using TypeScript)
interface User {
  name: string;
  email: string;
  token: string;
}

// Define the initial state
const userStore = writable<User | null>(null); // Stores the logged-in user data
const isAuthenticatedStore = writable<boolean>(false); // Boolean flag to track authentication status

// Define the custom store object with methods
const authStore = {
  // Expose the user store
  user: userStore,

  // Expose the isAuthenticated store
  isAuthenticated: isAuthenticatedStore,

  // Function to decode and verify JWT using jose
  async verifyAndDecodeJwt(token: string) {
    try {
      // Google's public keys (you can cache this URL in production)
      const JWKS = createRemoteJWKSet(new URL(GOOGLE_JWK_URL));

      // Verify the JWT
      const { payload } = await jwtVerify(token, JWKS, {
        issuer: GOOGLE_JWK_ISSUER,
        audience: CLIENT_ID,
      });

      // JWT is valid, now set the user in the store
      console.log('Decoded JWT Payload:', payload);

      userStore.set({
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      });

      isAuthenticatedStore.set(true);
    } catch (error) {
      console.error('JWT verification failed:', error);
      userStore.set({});
      isAuthenticatedStore.set(false);
    }
  },

  // open the google one tap popup/dialog
  open: () => {
    console.log('opening one tap');
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: loginCallback,
      auto_select: true,
      // prompt_parent_id: 'oneTapDiv',
    });

    google.accounts.id.prompt(); // Displays the One Tap prompt

    console.log('Google One Tap initialized');
  },
  
  // Login function with JWT verification
  login: async (credentialResponse) => {
    const token = credentialResponse.credential;

    // Verify the token
    await authStore.verifyAndDecodeJwt(token);
  },

  // Logout function to reset user and authentication status
  logout: () => {
    userStore.set({});
    isAuthenticatedStore.set(false);
    localStorage.removeItem(LOCALSTORAGE_USER_KEY); // remove from local storage
    console.log('User logged out');
  },

  

  // Initialize the store (for example, check local storage for stored credentials)
  init: () => {
    const storedUser = localStorage.getItem(LOCALSTORAGE_USER_KEY);
    if (storedUser) {
      authStore.login(JSON.parse(storedUser));
    } else {
      isAuthenticatedStore.set(false);
    }
  }
};

function loginCallback(resp) {
  if (resp.credential) {
    authStore.login(resp);
    localStorage.setItem(LOCALSTORAGE_USER_KEY, JSON.stringify(resp)); // Store in local storage
  } else {
    console.error("unable to parse login response", resp);
  }
}


export default authStore;