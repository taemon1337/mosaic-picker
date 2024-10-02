import { get } from "svelte/store";
import authStore from "./auth";

export async function fetchGooglePhotosAlbums() {
    const user = get(authStore.user);
  
    if (!user) {
      throw new Error('User is not authenticated');
    }
  
    const token = user.token; // Assume the token is stored in the authStore
  
    try {
      const response = await fetch('https://photoslibrary.googleapis.com/v1/albums', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  // Use the JWT for auth
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch albums');
      }
  
      const data = await response.json();
      console.log('Albums:', data);
      return data;  // Return the data (e.g., albums) for further use in the app
    } catch (error) {
      console.error('Error fetching albums:', error);
      return null;
    }
  }