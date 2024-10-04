// src/lib/stores/auth.js
import { writable } from 'svelte/store';

// Simple base64 encoding for obfuscation
function obfuscate(data) {
  return btoa(data);
}

function deobfuscate(data) {
  try {
    return atob(data);
  } catch (e) {
    return null;
  }
}

export const authStore = writable({
  isAuthenticated: false
});

export function setAuthenticated(status) {
  // Obfuscate authentication state before storing
  authStore.set({ isAuthenticated: obfuscate(status.toString()) });
}

export function isAuthenticated() {
  // Read and deobfuscate the authentication state
  let auth;
  authStore.subscribe((value) => {
    auth = deobfuscate(value.isAuthenticated);
  })();

  return auth === 'true';
}