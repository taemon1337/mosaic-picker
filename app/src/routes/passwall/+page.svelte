<script>
    import bcrypt from 'bcryptjs';
    import authStore from '$lib/stores/auth';
    import { base } from '$app/paths';
    import { goto } from '$app/navigation';
    import { PUBLIC_ACCESS_CODE_HASH  } from '$env/static/public';

    let password = '';
    let error = '';
  
    const storedHash = PUBLIC_ACCESS_CODE_HASH || "$2a$10$Dn3zzux83huVXHzcqljtKO9Q8p9c1DdX7tMuhrUU1sG3qxI/HgdFq" // Pre-generated bcrypt hash

    async function submitPassword() {
      error = '';
      const match = await bcrypt.compare(password, storedHash);
      console.log('checking if "' + password + '" is a valid access code', match);
      if (match) {
        authStore.isAccessible.set(true);
        goto(base+"/"); // Redirect to the home page
      } else {
        error = 'Incorrect access code. Please contact admin.';
        password = ''; // clear out entered password
      }
    }
  </script>
  
<form on:submit|preventDefault={submitPassword}>
  <article class="medium middle-align center-align">
    <div>
      <i class="extra">person</i>
      <h5>You do not have access to enter this site</h5>
      <p>Please enter your access code</p>
      <div class="space"></div>
      <nav class="no-space">
        <div class="max field border left-round">
            <input type="password" bind:value={password} placeholder="Enter access code" />
            {#if error}
              <span class="error">{error}</span>
            {/if}
        </div>
        <button type="submit" class="large right-round">Submit</button>
      </nav>
    </div>
  </article>
</form>
  