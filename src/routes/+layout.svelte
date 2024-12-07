<script>
  import '@material-design-icons/font/index.css';
  import 'beercss/dist/cdn/beer.min.css';
  import 'material-dynamic-colors/dist/cdn/material-dynamic-colors.min.js';
  import Sidenav from '$lib/components/Sidenav.svelte';
  import { page } from '$app/stores';
</script>

<main class="responsive">
  <Sidenav session={$page.data.session} />
  <slot />
</main>