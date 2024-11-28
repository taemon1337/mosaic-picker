<script lang="ts">
   import { signIn } from "@auth/sveltekit/client"
   import { base } from "$app/paths";

   let user = {}
   let authenticated = false;
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
    {#if authenticated}
    <a href="{base}/studio">
      <i>create</i>
      <div>Mosaic Studio</div>
    </a>
    <a href="{base}/library">
      <img class="circle tiny" src="{user.picture}" alt="{user.name}">
      <div>My Mosaics</div>
    </a>
    <a>
      <i>logout</i>
      <div>Logout</div>
    </a>
    {:else}
    <a on:click={signIn}>
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
  </nav>
</div>