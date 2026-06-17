import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { plexServerAccountsQuery } from '$lib/requests/plex/plexServerAccountsQuery.ts';
import { plexSettingsQuery } from '$lib/requests/plex/plexSettingsQuery.ts';
import { plexUpdateSettingsRequest } from '$lib/requests/plex/plexUpdateSettingsRequest.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  firstValueFrom,
  map,
} from 'rxjs';

export function usePlexServer({ serverId }: { serverId: string }) {
  const { invalidate } = useInvalidator();

  const accountsQuery = useQuery(plexServerAccountsQuery({ serverId }));
  const isLoadingAccounts = accountsQuery.pipe(map((q) => q.isLoading));
  const serverAccounts = accountsQuery.pipe(map((q) => q.data));

  const plexSettings = useQuery(plexSettingsQuery()).pipe(map((q) => q.data));

  // Optimistic overrides: uuid → isSelected (persist until component unmounts)
  const libraryOverrides = new BehaviorSubject<ReadonlyMap<string, boolean>>(
    new Map(),
  );

  const libraries = combineLatest([
    serverAccounts.pipe(map((data) => data?.libraries ?? [])),
    libraryOverrides,
  ]).pipe(
    map(([base, overrides]) =>
      base.map((lib) => ({
        ...lib,
        isSelected: overrides.has(lib.uuid)
          ? overrides.get(lib.uuid)!
          : lib.isSelected,
      }))
    ),
  );

  // Override takes precedence over server state; null means use server value
  const selectedUserIdOverride = new BehaviorSubject<string | null>(null);

  const selectedUserId = combineLatest([plexSettings, selectedUserIdOverride])
    .pipe(
      map(([settings, override]) =>
        override ?? settings?.sync.selection.userIds.at(0) ?? ''
      ),
    );

  async function toggleLibrary(uuid: string) {
    const currentLibraries = await firstValueFrom(libraries);
    const lib = currentLibraries.find((l) => l.uuid === uuid);
    if (!lib) return;

    const newValue = !lib.isSelected;

    const newOverrides = new Map(libraryOverrides.getValue());
    newOverrides.set(uuid, newValue);
    libraryOverrides.next(newOverrides);

    try {
      const settings = await firstValueFrom(
        plexSettings.pipe(filter((s) => s != null)),
      );

      const otherServerLibs = settings.sync.selection.libraryIds
        .filter((l) => l.serverId !== serverId)
        .map((l) => ({ server_id: l.serverId, uuid: l.uuid }));

      const thisServerLibs = currentLibraries
        .map((l) => ({
          uuid: l.uuid,
          isSelected: l.uuid === uuid ? newValue : l.isSelected,
        }))
        .filter((l) => l.isSelected)
        .map((l) => ({ server_id: serverId, uuid: l.uuid }));

      const success = await plexUpdateSettingsRequest({
        settings: {
          sync: {
            selection: { library_ids: [...otherServerLibs, ...thisServerLibs] },
          },
        },
      });

      if (!success) {
        throw new Error('Failed to update library settings');
      }

      await invalidate(InvalidateAction.Plex.Settings);
    } catch {
      const revertedOverrides = new Map(libraryOverrides.getValue());
      revertedOverrides.delete(uuid);
      libraryOverrides.next(revertedOverrides);
    }
  }

  async function selectAccount(userId: string) {
    const previous = selectedUserIdOverride.getValue();
    selectedUserIdOverride.next(userId);
    try {
      const success = await plexUpdateSettingsRequest({
        settings: {
          sync: { selection: { user_ids: userId ? [userId] : [] } },
        },
      });
      if (!success) {
        throw new Error('Failed to update account settings');
      }
      await invalidate(InvalidateAction.Plex.Settings);
    } catch {
      selectedUserIdOverride.next(previous);
    }
  }

  return {
    isLoadingAccounts,
    serverAccounts,
    libraries,
    selectedUserId,
    toggleLibrary,
    selectAccount,
  };
}
