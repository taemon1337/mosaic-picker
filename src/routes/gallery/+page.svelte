<script lang="ts">
    import { onMount } from "svelte";
    import { base } from "$app/paths";

    let mosaics = [];

    onMount(async () => {
        // TODO: Implement mosaic loading
        mosaics = [
            {
                id: '1',
                name: 'Birthday Mosaic',
                thumbnail: `${base}/images/birthday/birthday-mosaic.jpg`,
                created: new Date().toLocaleDateString()
            },
            {
                id: '2',
                name: 'Family Mosaic',
                thumbnail: `${base}/images/birthday/birthday-mosaic-light.jpg`,
                created: new Date().toLocaleDateString()
            }
        ];
    });
</script>

<div class="container">
    <h1>Public Mosaics</h1>

    <div class="grid">
        {#each mosaics as mosaic}
            <div class="s12 m6 l4">
                <article class="border medium no-padding">
                    <div class="padding">
                        <h6>{mosaic.name}</h6>
                        <p>Created: {mosaic.created}</p>
                    </div>
                    <img src={mosaic.thumbnail} alt={mosaic.name} class="responsive">
                </article>
            </div>
        {/each}
    </div>
</div>