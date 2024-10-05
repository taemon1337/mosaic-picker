<script>
    import { onMount } from 'svelte';
    import authStore from '$lib/stores/auth';
  
    onMount(async () => {
      // Get authorization code from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const authorizationCode = urlParams.get('code');
  
      if (authorizationCode) {
        authStore.exchangeAuthorizationCodeForAccessToken(authorizationCode);
      }
    });
  </script>
  
  <p>Redirecting...</p>