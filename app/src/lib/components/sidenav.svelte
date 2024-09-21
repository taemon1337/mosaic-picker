<script>
    import { isLoggedIn, user } from '$lib/stores/auth.js';

    let loggedIn;
    let currentUser;

    // Subscribe to the auth store
    $: loggedIn = $isLoggedIn;
    $: currentUser = $user;
</script>
<div>
    <nav class="left drawer l">
    <header>
      <nav>
        <img src="%sveltekit.assets%/favicon.png" class="circle" alt="sveltekit">
        <h6>Mosaic</h6>
      </nav>
    </header>
    <a href="/">
      <i>home</i>
      <div>Home</div>
    </a>
    <a href="/login">
      <i>account_circle</i>
      <div>Login</div>
    </a>
    <a href="/studio">
      <i>create</i>
      <div>Mosaic Studio</div>
    </a>
    <a href="/library">
      <i>search</i>
      <div>My Mosaics</div>
    </a>
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