<script lang="ts">
    import { onMount } from "svelte";
    import { v4 as uuidv4 } from "uuid";
    import { fetchGooglePhotosAlbums } from "$lib/stores/photos";
    import { base } from "$app/paths";

    let albums = [];

    let mosaic = {
        name: "my-mosaic-" + uuidv4(),
        background: base + "/images/background_600x400.png",
        tiles: [],
    };

    onMount(async () => {
        albums = await fetchGooglePhotosAlbums();
    });
</script>

<div class="container">
    <h1>Create A Mosaic</h1>
    
    <div class="grid">
        <div class="s12 m8">
            <article class="border medium no-padding mosaic-background" style="background-image: url('{mosaic.background}')">
                <div class="padding absolute center middle">
                    <h5>Mosaic Background</h5>
                    <div>Click to change background image...</div>
                </div>
            </article>
        </div>
        
        <div class="s12 m4">
            <article class="border medium">
                <div class="padding">
                    <h5>Settings</h5>
                    <div class="field label border">
                        <input type="text" bind:value={mosaic.name}>
                        <label>Mosaic Name</label>
                    </div>
                </div>
            </article>
        </div>
    </div>

    <h5>Photo Albums</h5>
    <div class="grid">
        {#each albums as album}
            <div class="s12 m6 l3">
                <article class="border medium no-padding">
                    <img src={album.coverPhotoBaseUrl} alt={album.title} class="responsive">
                    <div class="padding">
                        <h6>{album.title}</h6>
                        <p>{album.mediaItemsCount} items</p>
                    </div>
                </article>
            </div>
        {/each}
    </div>
</div>

<style>
    .mosaic-background {
        height: 400px;
        width: 100%;
        background-size: cover;
        background-position: center;
        color: white;
        position: relative;
    }

    .container {
        padding: 2rem;
    }

    .grid {
        margin-top: 2rem;
        margin-bottom: 2rem;
    }

    article {
        height: 100%;
    }

    img.responsive {
        aspect-ratio: 16/9;
        object-fit: cover;
    }
</style>
