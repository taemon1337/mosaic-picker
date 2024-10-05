<script>
  import { onMount } from 'svelte';
  import authStore from '$lib/stores/auth';
  import { base } from '$app/paths';

  let user = authStore.user;
  let accessible = authStore.isAccessible;
  let authenticated = authStore.isAuthenticated;

  onMount(async () => {
    authStore.init();
  });
</script>
<div>
    <nav class="left drawer l">
    <header>
      <nav>
        <img src="{base}/favicon.png" class="circle" alt="sveltekit">
        <h6>photoMosaic</h6>
      </nav>
    </header>
    <a href="{base}/">
      <i>home</i>
      <div>Home</div>
    </a>
    {#if $accessible}
    <a href="{base}/studio">
      <i>create</i>
      <div>Mosaic Studio</div>
    </a>
    {#if $authenticated && $user}
    <a href="{base}/library">
      <img class="circle tiny" src="{$user.picture}" alt="{user.name}">
      <div>My Mosaics</div>
    </a>
    <a on:click={authStore.logout}>
      <i>logout</i>
      <div>Logout</div>
    </a>
    {:else}
    <a on:click={authStore.open}>
      <i>account_circle</i>
      <div>
        <div>Login</div>
      </div>
    </a>
    {/if}
    <div class="divider"></div>
    <a href="{base}/gallery">
      <i>public</i>
      <div>Public Gallery</div>
    </a>
    <a href="{base}/help">
      <i>help</i>
      <div>Help</div>
    </a>
    {/if}  
  </nav>
</div>