import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { PlexErrorCode } from '$lib/requests/plex/PlexErrorCode.ts';
import { plexServerAccountsQuery } from '$lib/requests/plex/plexServerAccountsQuery.ts';
import { plexSettingsQuery } from '$lib/requests/plex/plexSettingsQuery.ts';
import { plexUpdateSettingsRequest } from '$lib/requests/plex/plexUpdateSettingsRequest.ts';
import { refetchQuery } from '$lib/features/query/refetchQuery.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  firstValueFrom,
  map,
} from 'rxjs';

type PlexSelectionUpdate = NonNullable<
  NonNullable<
    Parameters<typeof plexUpdateSettingsRequest>[0]['settings']['sync']
  >['selection']
>;

const UNRECOVERABLE_ERROR_CODES = new Set<PlexErrorCode>([
  'missing_token',
  'bad_auth',
  'missing_server_id',
  'invalid_server_id',
]);

export function usePlexServer({ serverId }: { serverId: string }) {
  const { invalidate } = useInvalidator();
  const { user } = useUser();

  const accountsQuery = useQuery(plexServerAccountsQuery({ serverId }));
  const retryAccounts = () => refetchQuery(accountsQuery);

  const accountsResult = accountsQuery.pipe(
    map((q) => {
      const accounts = q.data && !('errorCode' in q.data) ? q.data : undefined;
      const code = q.data && 'errorCode' in q.data
        ? q.data.errorCode
        : undefined;

      return {
        accounts,
        error: accounts == null && (code != null || q.isError)
          ? {
            code,
            retry: code && UNRECOVERABLE_ERROR_CODES.has(code)
              ? undefined
              : retryAccounts,
          }
          : undefined,
        isLoading: toLoadingState(q),
      };
    }),
  );

  const serverAccounts = accountsResult.pipe(map((r) => r.accounts));
  const accountsError = accountsResult.pipe(map((r) => r.error));
  const isLoadingAccounts = accountsResult.pipe(
    map((r) => r.isLoading && r.accounts == null),
  );

  const plexSettings = useQuery(plexSettingsQuery()).pipe(map((q) => q.data));

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

  const hasSelection = libraries.pipe(
    map((libs) => libs.some((lib) => lib.isSelected)),
  );

  const hasChanges = combineLatest([
    serverAccounts.pipe(map((data) => data?.libraries ?? [])),
    libraryOverrides,
    plexSettings,
    selectedUserIdOverride,
  ]).pipe(
    map(([base, overrides, settings, userOverride]) => {
      const isLibraryChanged = [...overrides.entries()].some(
        ([uuid, isSelected]) =>
          (base.find((lib) => lib.uuid === uuid)?.isSelected ?? false) !==
            isSelected,
      );

      const baseUserId = settings?.sync.selection.userIds.at(0) ?? '';
      const isUserChanged = userOverride != null && userOverride !== baseUserId;

      return isLibraryChanged || isUserChanged;
    }),
  );

  async function toggleLibrary(uuid: string) {
    const currentLibraries = await firstValueFrom(libraries);
    const lib = currentLibraries.find((l) => l.uuid === uuid);
    if (!lib) return;

    const newOverrides = new Map(libraryOverrides.getValue());
    newOverrides.set(uuid, !lib.isSelected);
    libraryOverrides.next(newOverrides);
  }

  function selectAccount(userId: string) {
    selectedUserIdOverride.next(userId);
  }

  function toOtherServerLibraries(
    libraryIds: ReadonlyArray<{ serverId: string; uuid: string }>,
  ) {
    return libraryIds
      .filter((l) => l.serverId !== serverId)
      .map((l) => ({ server_id: l.serverId, uuid: l.uuid }));
  }

  async function writeSelection(
    selection: PlexSelectionUpdate,
  ): Promise<boolean> {
    const success = await plexUpdateSettingsRequest({
      settings: { sync: { selection } },
    }).catch(() => false);

    if (!success) {
      return false;
    }

    await invalidate(InvalidateAction.Plex.Settings);
    return true;
  }

  async function saveChanges(): Promise<boolean> {
    const currentLibraries = await firstValueFrom(libraries);
    const settings = await firstValueFrom(
      plexSettings.pipe(filter((s) => s != null)),
    );

    const currentUser = await firstValueFrom(user);

    if (currentUser == null) {
      return false;
    }

    const otherServerLibs = currentUser.isVip
      ? toOtherServerLibraries(settings.sync.selection.libraryIds)
      : [];

    const thisServerLibs = currentLibraries
      .filter((l) => l.isSelected)
      .map((l) => ({ server_id: serverId, uuid: l.uuid }));

    const userId = await firstValueFrom(selectedUserId);

    return writeSelection({
      library_ids: [...otherServerLibs, ...thisServerLibs],
      user_ids: userId ? [userId] : [],
    });
  }

  async function removeServer(): Promise<boolean> {
    const settings = await firstValueFrom(
      plexSettings.pipe(filter((s) => s != null)),
    );

    return writeSelection({
      server_ids: settings.sync.selection.serverIds
        .filter((id) => id !== serverId),
      library_ids: toOtherServerLibraries(settings.sync.selection.libraryIds),
    });
  }

  return {
    isLoadingAccounts,
    serverAccounts,
    accountsError,
    libraries,
    selectedUserId,
    hasSelection,
    hasChanges,
    toggleLibrary,
    selectAccount,
    saveChanges,
    removeServer,
  };
}
