<script lang="ts">
    import { onMount } from 'svelte';
    import { decodeJwtResponse, onGoogleScriptLoad } from '$lib/stores/auth.ts';
    
    onMount(() => {
      onGoogleScriptLoad(decodeJwtResponse);
    });
  </script>
  
  <div id="googleSignIn"></div>