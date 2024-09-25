<script lang="ts">
  import { onMount } from 'svelte';
  import { setUser, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SCOPES } from "$lib/stores/auth.js";
    
  let clientId = GOOGLE_CLIENT_ID;

  onMount(() => {
    const handleLogin = (event) => {
      const response = event.detail;
      console.log('Google login response:', response);
      
      // Update the Svelte store with the response
      setUser(response);
    };

    const loadClient = (event) => {
      console.log('loading google client');
    };

    window.addEventListener('google-login', handleLogin);
    window.addEventListener('google-account', loadClient);

    // Cleanup the event listener when the component is destroyed
    return () => {
      window.removeEventListener('google-login', handleLogin);
      window.removeEventListener('google-account', loadClient);
    };
  });
  </script>
  
  <div>
    <!-- <div id="g_id_onload" data-client_id="{$clientId}" data-callback="handleToken" data-your_own_param_1_to_login="any_value"></div> -->
  </div>
