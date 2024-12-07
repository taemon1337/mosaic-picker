<script>
    import { onDestroy } from "svelte";
    import { v4 as uuidv4 } from "uuid";
    import { selectedPhotos, openPhotoPicker } from "$lib/stores/photos";
    import { page } from "$app/stores";

    let mosaic = {
        id: uuidv4(),
        tiles: []
    };

    let loadingPhotos = false;

    // Subscribe to the photos store
    const unsubscribe = selectedPhotos.subscribe((photos) => {
        console.log('Selected photos updated:', photos);
    });

    // Cleanup subscription on component destroy
    onDestroy(() => {
        unsubscribe();
    });

    async function handlePhotoSelect() {
        const session = $page.data.session;
        if (!session?.accessToken) {
            throw new Error('No access token available');
        }

        loadingPhotos = true;
        try {
            // Check if we have a valid token
            if (session.provider !== 'google') {
                throw new Error("Please login to access Google Photos. Current provider: " + session.provider);
            }

            await openPhotoPicker(session.accessToken);
        } catch (error) {
            console.error('Error selecting photos:', error);
            throw error;
        } finally {
            loadingPhotos = false;
        }
    }
</script>

<div class="container">
    <div class="grid">
        <div class="s12">
            <article class="border medium">
                <div class="padding">
                    <h5>Mosaic Photos</h5>
                    <button class="border" on:click={handlePhotoSelect} disabled={loadingPhotos}>
                        {#if loadingPhotos}
                            <i class="material-icons spin">refresh</i> Loading...
                        {:else}
                            <i class="material-icons">add_photo_alternate</i> Add Photos
                        {/if}
                    </button>
                </div>

                {#if $selectedPhotos.length > 0}
                    <div class="padding">
                        <div class="grid">
                            {#each $selectedPhotos as photo}
                                <div class="s12 m3 l2">
                                    <article class="border medium no-padding">
                                        <img src={photo.url()} alt={photo.filename} class="responsive">
                                    </article>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
            </article>
        </div>
    </div>
</div>

<style>
    .spin {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        100% {
            transform: rotate(360deg);
        }
    }
</style>