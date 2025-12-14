import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { Permission } from '$lib/requests/models/Permission.ts';
import { map } from 'rxjs';

export function usePermissions(permission: Permission) {
  const { user } = useUser();

  const isPermitted = user.pipe(
    map(($user) => {
      if (!$user) {
        return false;
      }

      return $user.permissions.includes(permission);
    }),
  );

  return { isPermitted };
}
