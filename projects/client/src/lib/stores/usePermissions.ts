import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { Permission } from '$lib/requests/models/Permission.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { map } from 'rxjs';

export function usePermissions(permission: Permission) {
  const { user } = useUser();

  const isPermitted = toObservable(user).pipe(
    map((u) => {
      if (!u) {
        return false;
      }

      return u.permissions.includes(permission);
    }),
  );

  return { isPermitted };
}
