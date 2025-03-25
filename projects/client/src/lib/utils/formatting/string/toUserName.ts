import type { UserName } from '$lib/requests/models/UserName.ts';

export function toUserName(name: string | Nil): UserName {
  const fullName = name ?? '';
  const parts = fullName.split(' ');

  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ');

  return {
    full: fullName,
    first: firstName,
    last: lastName,
  };
}
