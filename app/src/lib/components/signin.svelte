<script lang="ts">
  import { onMount } from 'svelte';
  import { setUser, GOOGLE_CLIENT_ID } from "$lib/stores/auth.js";
    
  let clientId = GOOGLE_CLIENT_ID;

  onMount(() => {
    const handleLogin = (event) => {
      const response = event.detail;
      console.log('Google login response:', response);
      
      // Update the Svelte store with the response
      setUser(response);
    };

    window.addEventListener('google-login', handleLogin);

    // Cleanup the event listener when the component is destroyed
    return () => {
      window.removeEventListener('google-login', handleLogin);
    };
  });
  </script>
  
  <div>
    <div id="g_id_onload" data-client_id="{$clientId}" data-callback="handleToken" data-your_own_param_1_to_login="any_value"></div>
  </div>
