<script>
    import { signIn, signOut } from "@auth/sveltekit/client";
    import { base } from "$app/paths";

    export let session;
</script>

<nav class="left drawer 1">
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
    {#if session}
    <a href="{base}/studio">
      <i>create</i>
      <div>Mosaic Studio</div>
    </a>
    {#if session?.user}
    <a href="{base}/library">
      <img class="circle tiny" src="{session.user.image}" alt="">
      <div>{session.user.name || 'User'} Mosaics</div>
    </a>
    {/if}
    <a on:click={signOut}>
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