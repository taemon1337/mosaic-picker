<script lang="ts">
  import { GOOGLE_CLIENT_ID } from "$lib/stores/auth.js";
    
  let clientId = GOOGLE_CLIENT_ID;

  function handleToken(resp) {
    console.log('RESP', resp);
  }
  </script>
  
  <div>
    <div id="g_id_onload" data-client_id="{$clientId}" data-callback="handleToken" data-your_own_param_1_to_login="any_value"></div>
  </div>
