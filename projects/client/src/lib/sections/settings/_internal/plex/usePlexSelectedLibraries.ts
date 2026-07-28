import { useQuery } from '$lib/features/query/useQuery.ts';
import { plexSettingsQuery } from '$lib/requests/plex/plexSettingsQuery.ts';
import { map } from 'rxjs';

export function usePlexSelectedLibraries() {
  return useQuery(plexSettingsQuery()).pipe(
    map((query) => query.data?.sync.selection.libraryIds ?? []),
  );
}
