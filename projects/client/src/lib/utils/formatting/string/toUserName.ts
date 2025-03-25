import type { UserName } from '$lib/requests/models/UserName.ts';

export function toUserName(name: string | Nil): UserName {
  const fullName = name ?? '';
  const [firstName = '', lastName = ''] = fullName.split(' ');

  return {
    full: fullName,
    first: firstName,
    last: lastName,
  };
}
