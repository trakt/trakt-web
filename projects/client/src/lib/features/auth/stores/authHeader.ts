import { getToken } from '$lib/features/auth/token/index.ts';

export function authHeader() {
  return {
    Authorization: `Bearer ${getToken()}`,
  };
}
