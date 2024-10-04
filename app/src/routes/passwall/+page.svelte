<script>
    import bcrypt from 'bcryptjs';
    import { setAuthenticated } from '$lib/stores/passwall';
    import { base } from '$app/paths';
    import { goto } from '$app/navigation';
  
    let password = '';
    let error = '';
  
    const storedHash = '$2a$10$L8u2IvH1...'; // Pre-generated bcrypt hash
  
    async function submitPassword() {
      const match = await bcrypt.compare(password, storedHash);
      if (match) {
        setAuthenticated(true);
        goto(base); // Redirect to the home page
      } else {
        error = 'Incorrect password. Please try again.';
      }
    }
  </script>
  
  <form on:submit|preventDefault={submitPassword}>
    <input type="password" bind:value={password} placeholder="Enter password" />
    <button type="submit">Submit</button>
    {#if error}
      <p>{error}</p>
    {/if}
  </form>