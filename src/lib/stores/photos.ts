import { writable, type Writable } from 'svelte/store';
import { GooglePhotosPicker } from '$lib/api/google-photos-picker';

export interface PhotoItem {
    id: string;
    baseUrl: string;
    filename: string;
    mimeType: string;
}

export const selectedPhotos: Writable<PhotoItem[]> = writable([]);

const PHOTOS_LIBRARY_API_BASE = 'https://photoslibrary.googleapis.com/v1';

export async function fetchGooglePhotosAlbums(accessToken: string) {
    const response = await fetch(`${PHOTOS_LIBRARY_API_BASE}/albums`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch albums: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.albums || [];
}

export async function openPhotoPicker(accessToken: string): Promise<void> {
    if (!accessToken) {
        throw new Error('No access token available');
    }

    try {
        const picker = new GooglePhotosPicker(accessToken);
        const photos = await picker.openPicker();
        selectedPhotos.set(photos);
        console.log('Updated photos store with:', photos);
    } catch (error) {
        console.error('Error in photo picker:', error);
        throw error;
    }
}

export function clearSelectedPhotos(): void {
    selectedPhotos.set([]);
}
