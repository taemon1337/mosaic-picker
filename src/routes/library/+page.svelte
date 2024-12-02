<script lang="ts">
    import { onMount } from "svelte";
    import { fetchGooglePhotosAlbums } from "$lib/stores/photos";

    let albums = [];
    let selectedAlbum = null;
    let photos = [];

    onMount(async () => {
        albums = await fetchGooglePhotosAlbums();
    });

    async function loadPhotos(albumId: string) {
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

<style>
    .container {
        padding: 2rem;
    }

    .grid {
        margin-top: 2rem;
    }

    img.responsive {
        aspect-ratio: 1;
        object-fit: cover;
    }

    button.active {
        background: var(--primary);
        color: white;
    }

    .badge {
        background: var(--surface-variant);
        padding: 0.25rem 0.5rem;
        border-radius: 1rem;
        font-size: 0.8rem;
    }

    button.active .badge {
        background: var(--primary-container);
    }
</style>
