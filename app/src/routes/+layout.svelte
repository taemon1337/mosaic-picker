<script>
    import Sidenav from '$lib/components/sidenav.svelte';
    import { base } from '$app/paths';
    import authStore from '$lib/stores/auth';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { browser, dev } from '$app/environment';

    $: if (browser && !dev && !authStore.accessible($page.url.pathname)) {
      goto(base+'/passwall');
    }
</script>

<svelte:head>
  <link rel="icon" href="{base}/favicon.png" />
</svelte:head>

<Sidenav />

<main class="responsive">
    <slot />
</main>