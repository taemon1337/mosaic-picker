<script>
    import SignIn from '$lib/components/signin.svelte';
    import { user } from "$lib/stores/auth.js";
</script>
<div>
    <nav class="left drawer l">
    <header>
      <nav>
        <img src="/favicon.png" class="circle" alt="sveltekit">
        <h6>photoMosaic</h6>
      </nav>
    </header>
    <a href="/">
      <i>home</i>
      <div>Home</div>
    </a>
    {#if $user}
    <a href="/studio">
      <i>create</i>
      <div>Mosaic Studio</div>
    </a>
    <a href="/library">
      <img class="circle tiny" src="{$user.picture}">
      <div>My Mosaics</div>
    </a>
    {:else}
    <a href="/login">
      <i>account_circle</i>
      <div>
        <SignIn />
        <div>Login</div>
      </div>
    </a>
    <a href="/studio">
      <i>create</i>
      <div>Mosaic Studio</div>
    </a>
    {/if}
    <div class="divider"></div>
    <a href="/gallery">
      <i>public</i>
      <div>Public Gallery</div>
    </a>
    <a href="/help">
      <i>help</i>
      <div>Help</div>
    </a>  
  </nav>
</div>