import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { createMediaSyncConnectionRequest } from '$lib/requests/media-sync/createMediaSyncConnectionRequest.ts';
import { createPlexPinRequest } from '$lib/requests/media-sync/createPlexPinRequest.ts';
import { MediaSyncFeedSchema } from '$lib/requests/media-sync/models/MediaSyncFeed.ts';
import { plexPinStatusRequest } from '$lib/requests/media-sync/plexPinStatusRequest.ts';
import { plexServerAccountsRequest } from '$lib/requests/media-sync/plexServerAccountsRequest.ts';
import { plexServerLibrariesRequest } from '$lib/requests/media-sync/plexServerLibrariesRequest.ts';
import { registerPlexPinRequest } from '$lib/requests/media-sync/registerPlexPinRequest.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import { BehaviorSubject } from 'rxjs';
import { onDestroy } from 'svelte';
import type { PlexConnectState } from './models/PlexConnectState.ts';
import { toDefaultServerId } from './toDefaultServerId.ts';
import { toLibraryChoice } from './toLibraryChoice.ts';

const POLL_INTERVAL = time.seconds(2);
const POPUP_NAME = 'trakt-plex-sign-in';
const POPUP_FEATURES = 'width=600,height=720';

export function usePlexConnect({ onConnected }: { onConnected: () => void }) {
  const state = new BehaviorSubject<PlexConnectState>({ step: 'idle' });
  let popup: Window | null = null;
  let pollTimer: ReturnType<typeof setTimeout> | undefined;
  let latestStartId = 0;

  const create = useMutation(defineMutation({
    key: 'media-sync:create-connection',
    request: createMediaSyncConnectionRequest,
    invalidations: [InvalidateAction.MediaSync.Connections],
  }));

  function stopPolling() {
    clearTimeout(pollTimer);
    pollTimer = undefined;
  }

  function closePopup() {
    popup?.close();
    popup = null;
  }

  onDestroy(() => {
    stopPolling();
    closePopup();
    state.complete();
  });

  function isWaitingOn(attemptId: string) {
    const current = state.value;
    return current.step === 'waiting' && current.attemptId === attemptId;
  }

  async function poll(attemptId: string, deadline: number) {
    if (!isWaitingOn(attemptId)) return;

    if (Date.now() > deadline) {
      closePopup();
      state.next({ step: 'expired' });
      return;
    }

    const status = await plexPinStatusRequest({ attemptId }).catch(() => null);
    if (!isWaitingOn(attemptId)) return;

    if (status?.status !== 'claimed') {
      pollTimer = setTimeout(() => poll(attemptId, deadline), POLL_INTERVAL);
      return;
    }

    closePopup();
    state.next({
      step: 'choosing',
      attemptId,
      servers: status.servers,
      serverId: null,
      libraries: null,
      libraryIds: [],
      accounts: null,
      accountId: null,
    });

    const serverId = toDefaultServerId(status.servers);
    if (serverId) await chooseServer(serverId);
  }

  async function start() {
    const startId = ++latestStartId;
    stopPolling();
    popup = globalThis.window.open('', POPUP_NAME, POPUP_FEATURES);
    state.next({ step: 'starting' });

    try {
      const pin = await createPlexPinRequest();
      if (startId !== latestStartId) return;

      const { attemptId, authUrl, expiresIn } = await registerPlexPinRequest({
        pin,
      });
      if (startId !== latestStartId) return;

      if (popup) popup.location.href = authUrl;
      state.next({ step: 'waiting', attemptId, authUrl });
      poll(attemptId, Date.now() + time.seconds(expiresIn));
    } catch {
      if (startId !== latestStartId) return;

      closePopup();
      state.next({ step: 'failed', error: 'sign_in_failed' });
    }
  }

  function openSignIn() {
    const current = state.value;
    if (current.step !== 'waiting') return;

    popup = globalThis.window.open(current.authUrl, POPUP_NAME, POPUP_FEATURES);
  }

  async function chooseServer(serverId: string) {
    const current = state.value;
    if (current.step !== 'choosing') return;

    state.next({
      ...current,
      serverId,
      libraries: null,
      libraryIds: [],
      accounts: null,
      accountId: null,
    });

    const target = { attemptId: current.attemptId, serverId };
    const [libraries, accounts] = await Promise.all([
      plexServerLibrariesRequest(target).catch(() => null),
      plexServerAccountsRequest(target).catch(() => null),
    ]);

    const latest = state.value;
    if (latest.step !== 'choosing' || latest.serverId !== serverId) return;

    if (!libraries || !accounts) {
      state.next({ step: 'failed', error: 'server_details_failed' });
      return;
    }

    state.next({
      ...latest,
      libraries,
      libraryIds: libraries.map((library) => library.externalId),
      accounts,
      accountId: accounts.find((account) => account.selected)?.accountId ??
        null,
    });
  }

  function chooseAccount(accountId: string) {
    const current = state.value;
    if (current.step !== 'choosing') return;

    state.next({ ...current, accountId });
  }

  function toggleLibrary(externalId: string, enabled: boolean) {
    const current = state.value;
    if (current.step !== 'choosing') return;

    state.next({
      ...current,
      libraryIds: toLibraryChoice(current.libraryIds, externalId, enabled),
    });
  }

  async function connect() {
    const current = state.value;
    if (current.step !== 'choosing' || !current.serverId) return;

    state.next({ step: 'connecting' });

    const result = await create.mutate({
      attemptId: current.attemptId,
      serverId: current.serverId,
      libraryIds: current.libraryIds,
      feeds: MediaSyncFeedSchema.options,
      syncAccountId: current.accountId,
    }).catch(() => null);

    if (!result?.ok) {
      state.next({ step: 'failed', error: result?.error ?? 'connect_failed' });
      return;
    }

    state.next({ step: 'idle' });
    onConnected();
  }

  function cancel() {
    latestStartId += 1;
    stopPolling();
    closePopup();
    state.next({ step: 'idle' });
  }

  return {
    state: state.asObservable(),
    start,
    openSignIn,
    chooseServer,
    chooseAccount,
    toggleLibrary,
    connect,
    cancel,
  };
}
