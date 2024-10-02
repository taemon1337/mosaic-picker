import { readable } from 'svelte/store';
import { env } from '$env/dynamic/public';

const SCOPES = env.PUBLIC_GOOGLE_SCOPES || 'https://www.googleapis.com/auth/drive.metadata.readonly'; // scopes required by API, separated by spaces
const CLIENT_ID = env.PUBLIC_GOOGLE_CLIENT_ID; // client ID from console.developers.google.com
const API_KEY = env.PUBLIC_GOOGLE_API_KEY; // API key from console.developers.google.com
const APP_ID = env.PUBLIC_GOOGLE_APP_ID; // project number from console.developers.google.com
const DISCOVERY_DOCS = [env.PUBLIC_GOOGLE_DISCOVERY_DOCS || 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// Define the Google Client configuration with discovery docs
export const GoogleOneTapStore = readable(null, (set) => {
  // Initialize Google One Tap
  const initOneTap = () => {
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredentialResponse, // Define your callback function below
      auto_select: true,
      prompt_parent_id: 'oneTapDiv',
    });

    google.accounts.id.prompt(); // Displays the One Tap prompt

    console.log('Google One Tap initialized');
  };

  // Function to handle One Tap sign-in response
  const handleCredentialResponse = (response) => {
    console.log('Google One Tap Credential Response:', response);
    // Optionally, you can use gapi to further verify the token or access Google APIs
    set(response); // Update the store with the credential response
  };

  // Load the Google API JS library if it's not already loaded
  initOneTap();

  // Clean-up logic (if necessary)
  return () => {
    console.log('Google One Tap cleanup');
  };
});