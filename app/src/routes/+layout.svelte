<script>
    import Sidenav from '$lib/components/sidenav.svelte';
    import { base } from '$app/paths';
</script>

<svelte:head>
  <link rel="icon" href="{base}/favicon.png" />
</svelte:head>

<Sidenav />

<main class="responsive">
    <slot />
</main>