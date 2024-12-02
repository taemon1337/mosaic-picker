<script>
  import { signIn, signOut } from '@auth/sveltekit/client';
  import 'beercss/dist/cdn/beer.min.css';
  import 'material-dynamic-colors/dist/cdn/material-dynamic-colors.min.js';
  import Sidenav from '$lib/components/Sidenav.svelte';
  import { page } from '$app/stores';

  export let data;

  let sidenavOpen = false;
  const toggleSidenav = () => {
    sidenavOpen = !sidenavOpen;
  };
</script>

<div class="layout">
  <nav>
    <button class="circle transparent" on:click={toggleSidenav}>
      <i class="material-icons">menu</i>
    </button>
    <a href="/" class="brand">
      <i class="material-icons">photo_library</i>
      <span>Mosaic Picker</span>
    </a>
    <div class="menu">
      {#if data.session}
        <button on:click={() => signOut()}>Sign Out</button>
      {:else}
        <button on:click={() => signIn('auth0')}>Sign In</button>
      {/if}
    </div>
  </nav>

  <Sidenav session={data.session} isOpen={sidenavOpen} />

  <main>
    <slot />
  </main>
</div>

<style>
  .layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  nav {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--primary);
    color: white;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
    text-decoration: none;
  }

  .menu {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .menu a {
    color: white;
    text-decoration: none;
  }

  main {
    flex: 1;
    padding: 2rem;
    min-height: calc(100vh - 4rem);
    margin-left: var(--sidenav-width, 0);
  }

  @media (max-width: 1023px) {
    main {
      margin-left: 0;
    }
  }

  @media (min-width: 1024px) {
    aside {
      transform: none;
    }

    main {
      margin-left: var(--sidenav-width, 300px);
    }

    nav button.circle {
      display: none;
    }
  }
</style>
