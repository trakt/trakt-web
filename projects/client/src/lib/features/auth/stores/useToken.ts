import { setToken } from '$lib/features/auth/token/index.ts';
import { writable } from 'svelte/store';

export function useToken(seed: string | Nil) {
  const token = writable<string | Nil>(seed);
  token.subscribe(setToken);

  return {
    token,
  };
}
