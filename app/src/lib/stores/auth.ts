import { writable, get } from 'svelte/store';
import { PUBLIC_GOOGLE_SCOPES, PUBLIC_GOOGLE_CLIENT_ID, PUBLIC_GOOGLE_API_KEY, PUBLIC_GOOGLE_APP_ID  } from '$env/static/public';
import { jwtVerify, createRemoteJWKSet } from 'jose'
import { base } from '$app/paths';
import bcrypt from "bcryptjs";

const SCOPES = PUBLIC_GOOGLE_SCOPES || 'https://www.googleapis.com/auth/photoslibrary.readonly'; // scopes required by API, separated by spaces
const CLIENT_ID = PUBLIC_GOOGLE_CLIENT_ID; // client ID from console.developers.google.com
const API_KEY = PUBLIC_GOOGLE_API_KEY; // API key from console.developers.google.com
const APP_ID = PUBLIC_GOOGLE_APP_ID; // project number from console.developers.google.com
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const GOOGLE_JWK_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const GOOGLE_JWK_ISSUER = 'https://accounts.google.com';
const LOCALSTORAGE_USER_KEY = 'user';
const LOCALSTORAGE_TOKEN_KEY = 'token';

// Example interface for user data (if using TypeScript)
interface User {
  name: string;
  email: string;
  picture: string;
  token: string;
}

// Define the initial state
const userStore = writable<User | null>(null); // Stores the logged-in user data
const tokenStore = writable<string>(""); // store for oauth access token
const isAuthenticatedStore = writable<boolean>(false); // Boolean flag to track authentication status
const isAccessibleStore = writable<boolean>(false);
let oauthClient = null;

// Define the custom store object with methods
const authStore = {
  // Expose the user store
  user: userStore,

  token: tokenStore, // oauth token (not to be confused with userStore.token)

  // Expose the isAuthenticated store
  isAuthenticated: isAuthenticatedStore,

  isAccessible: isAccessibleStore,

  oauthClient: oauthClient,

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
        token: token,
      });

      isAuthenticatedStore.set(true);
    } catch (error) {
      console.error('JWT verification failed:', error);
      isAuthenticatedStore.set(false);
      userStore.set(null);
      tokenStore.set("");
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

    const storedToken = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
    if (storedToken) {
      console.log('loading token from localstorage');
      authStore.token.set(JSON.parse(storedToken));
    } else {
      authStore.loadOAuth();
    }
  },

  // Logout function to reset user and authentication status
  logout: () => {
    isAuthenticatedStore.set(false);
    userStore.set(null);
    tokenStore.set("");
    localStorage.removeItem(LOCALSTORAGE_USER_KEY); // remove from local storage
    localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY); // remote stored token
    console.log('User logged out');
  },

  // after we have signed in, load oauth client with proper scope
  loadOAuth: () => {
    console.log('loading oauth client');
    let client = google.accounts.oauth2.initCodeClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      ux_mode: 'popup',
      login_hint: "timstello@gmail.com",
      callback: (authResponse) => {
        const authorizationCode = authResponse.code;

        // Now exchange this authorization code for an access token
        authStore.exchangeAuthorizationCodeForAccessToken(authorizationCode);
      },
      error_callback: (err) => {
        console.error("error loading oauth client", err);
      },
    });
    oauthClient = client; // set client
    oauthClient.requestCode();
  },

  exchangeAuthorizationCodeForAccessToken: async (authorizationCode) => {
    let redirectUri = `${window.location.origin}/auth-callback`;
  
    console.log('exchanging auth code for access token');
    const data = {
      code: authorizationCode,
      client_id: CLIENT_ID,
      client_secret: API_KEY,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    };
  
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(data)
    });
  
    const tokenResponse = await response.json();
    console.log('Access Token Response:', tokenResponse);
  
    if (tokenResponse.access_token) {
      // Store the access token and use it to call Google Photos API
      tokenStore.set(tokenResponse);
      localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, JSON.stringify(tokenResponse));
    } else {
      console.error("Failed to get access token:", tokenResponse);
    }
  },

  accessible: (url) => {
    let access = get(isAccessibleStore);
    if (access) {
      return url !== base+'/passwall'
    }
    return false; // default deny
  },

  hashPassword: async (pass) => {
    console.log("hashing password: ", pass);
    try {
      if (pass.length > 3) {
        const saltRounds = 10;
        let generatedHash = await bcrypt.hash(pass, saltRounds);
        console.log('Generated Hash:', generatedHash);
        return generatedHash;
      } else {
        console.log("password not long enough");
      }
    } catch (e) {
      console.log(e);
    }
  },

  // Initialize the store (for example, check local storage for stored credentials)
  init: () => {
    let access = get(isAccessibleStore);
    if (access) {
      const storedUser = localStorage.getItem(LOCALSTORAGE_USER_KEY);
      if (storedUser) {
        authStore.login(JSON.parse(storedUser));
      } else {
        isAuthenticatedStore.set(false);
        userStore.set(null);
      }
    } else {
      console.log('not accessible');
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