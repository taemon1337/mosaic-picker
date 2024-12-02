<script>
    import { signIn, signOut } from "@auth/sveltekit/client";
    import { base } from "$app/paths";

    export let session;
    export let isOpen;
</script>

<nav class="sidenav" class:active={isOpen}>
    <header>
        {#if session?.user}
            <img src={session.user.image || `${base}/images/default-avatar.png`} alt="User" class="circle">
            <div>
                <h6>{session.user.name || 'User'}</h6>
                <small>{session.user.email}</small>
            </div>
        {:else}
            <h6>photoMosaic</h6>
        {/if}
    </header>

    <div class="nav-links">
        <a href="/" class="nav-item">
            <i class="material-icons">home</i>
            <span>Home</span>
        </a>

        {#if session}
            <a href="/studio" class="nav-item">
                <i class="material-icons">brush</i>
                <span>Studio</span>
            </a>
            <a href="/gallery" class="nav-item">
                <i class="material-icons">collections</i>
                <span>Gallery</span>
            </a>
            <a href="/library" class="nav-item">
                <i class="material-icons">photo_library</i>
                <span>Library</span>
            </a>
            <button class="nav-item" on:click={() => signOut()}>
                <i class="material-icons">logout</i>
                <span>Sign Out</span>
            </button>
        {:else}
            <button class="nav-item" on:click={() => signIn('auth0')}>
                <i class="material-icons">login</i>
                <span>Sign In</span>
            </button>
        {/if}
    </div>
</nav>

<style>
    .sidenav {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 300px;
        background: white;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        transform: translateX(-100%);
        transition: transform 0.3s ease;
    }

    .sidenav.active {
        transform: translateX(0);
    }

    header {
        padding: 1rem;
        background: var(--primary);
        color: white;
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .circle {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
    }

    .nav-links {
        padding: 1rem 0;
    }

    .nav-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem 1rem;
        color: inherit;
        text-decoration: none;
        transition: background-color 0.2s;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        cursor: pointer;
    }

    .nav-item:hover {
        background: var(--surface-variant);
    }

    button.nav-item {
        font-size: inherit;
    }

    @media (min-width: 1024px) {
        .sidenav {
            transform: none;
        }
    }
</style>
