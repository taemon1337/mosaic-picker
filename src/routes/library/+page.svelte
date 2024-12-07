<script lang="ts">
    import { onMount } from "svelte";
    import { fetchGooglePhotosAlbums } from "$lib/stores/photos";
    import { page } from "$app/stores";

    let albums = [];
    let selectedAlbum = null;
    let photos = [];

    onMount(async () => {
        const session = $page.data.session;
        if (session?.accessToken) {
            try {
                albums = await fetchGooglePhotosAlbums(session.accessToken);
            } catch (error) {
                console.error('Failed to fetch albums:', error);
            }
        } else {
            console.error('No access token available');
        }
    });

    async function loadPhotos(albumId) {
        // TODO: Implement photo loading from Google Photos API
        selectedAlbum = albums.find(a => a.id === albumId);
        photos = Array(12).fill(null).map((_, i) => ({
            id: `photo-${i}`,
            baseUrl: `/images/placeholder.jpg`,
            filename: `Photo ${i + 1}`
        }));
    }
</script>

<div class="container">
    <h1>Photo Library</h1>

    <div class="grid">
        <div class="s12 m4 l3">
            <article class="border medium">
                <div class="padding">
                    <h5>Albums</h5>
                    <nav class="vertical">
                        {#each albums as album}
                            <button 
                                class="border" 
                                class:active={selectedAlbum?.id === album.id}
                                on:click={() => loadPhotos(album.id)}
                            >
                                {album.title}
                                <span class="badge">{album.mediaItemsCount}</span>
                            </button>
                        {/each}
                    </nav>
                </div>
            </article>
        </div>

        <div class="s12 m8 l9">
            {#if selectedAlbum}
                <h5>{selectedAlbum.title}</h5>
                <div class="grid">
                    {#each photos as photo}
                        <div class="s12 m6 l4 xl3">
                            <article class="border medium no-padding">
                                <img src={photo.baseUrl} alt={photo.filename} class="responsive">
                                <div class="padding">
                                    <p>{photo.filename}</p>
                                    <label class="checkbox">
                                        <input type="checkbox">
                                        <span>Select</span>
                                    </label>
                                </div>
                            </article>
                        </div>
                    {/each}
                </div>
            {:else}
                <article class="medium middle-align center-align">
                    <div>
                        <i class="material-icons extra">photo_library</i>
                        <h5>Select an album</h5>
                        <p>Choose an album from the list to view photos</p>
                    </div>
                </article>
            {/if}
        </div>
    </div>
</div>