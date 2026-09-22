import { useQuery } from '$lib/features/query/useQuery.ts';
import { plexSettingsQuery } from '$lib/requests/plex/plexSettingsQuery.ts';
import { map } from 'rxjs';

export function usePlexServerLimit() {
  return useQuery(plexSettingsQuery()).pipe(
    map((query) => query.data?.sync.serverLimit),
  );
}
