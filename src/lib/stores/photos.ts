import { writable } from 'svelte/store';

export const albums = writable([]);

export async function fetchGooglePhotosAlbums() {
    try {
        // TODO: Implement Google Photos API integration
        // This is a placeholder that returns mock data
        return [
            {
                id: '1',
                title: 'Vacation 2023',
                coverPhotoBaseUrl: '/images/placeholder.jpg',
                mediaItemsCount: 100
            },
            {
                id: '2',
                title: 'Family Photos',
                coverPhotoBaseUrl: '/images/placeholder.jpg',
                mediaItemsCount: 50
            }
        ];
    } catch (error) {
        console.error('Error fetching Google Photos albums:', error);
        return [];
    }
}
