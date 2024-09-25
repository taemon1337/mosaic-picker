import { readable, writable } from 'svelte/store';
import { env } from '$env/dynamic/public';

export const isLoggedIn = writable(false);
export const user = writable(null);
export const GOOGLE_CLIENT_ID = readable(env.PUBLIC_GOOGLE_CLIENT_ID);
export const GOOGLE_CLIENT_SCOPES = readable(env.PUBLIC_GOOGLE_CLIENT_SCOPES);

// Helper function to parse the JWT token (base64 decoding)
function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1]; // JWT structure is header.payload.signature
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
  
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  }
  
  // Function to update the user store
  export function setUser(loginResponse) {
    if (loginResponse && loginResponse.credential) {
      // Parse the base64-encoded JWT credential
      const parsedUser = parseJwt(loginResponse.credential);
      if (parsedUser.iss && parsedUser.aud && parsedUser.email && parsedUser.picture) {
        // Set the store with the parsed user data
        user.set({
            ...parsedUser, // Spread parsed user info
            rawCredential: loginResponse.credential, // Keep the raw credential if needed
        });
      } else {
        console.error("Login failed.", loginResponse);
      }
    } else {
      user.set(null); // Reset user if no credential is found
    }
  }