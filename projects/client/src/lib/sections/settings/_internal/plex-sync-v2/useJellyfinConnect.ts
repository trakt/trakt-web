import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { createMediaSyncConnectionRequest } from '$lib/requests/media-sync/createMediaSyncConnectionRequest.ts';
import {
  type JellyfinSignIn,
  jellyfinAuthRequest,
} from '$lib/requests/media-sync/jellyfinAuthRequest.ts';
import { jellyfinQuickConnectRequest } from '$lib/requests/media-sync/jellyfinQuickConnectRequest.ts';
import type { JellyfinAuth } from '$lib/requests/media-sync/models/JellyfinAuth.ts';
import type { MediaSyncFeed } from '$lib/requests/media-sync/models/MediaSyncFeed.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { time } from '$lib/utils/timing/time.ts';
import { BehaviorSubject } from 'rxjs';
import { onDestroy } from 'svelte';
import { JELLYFIN_FEEDS } from './JELLYFIN_FEEDS.ts';
import type { JellyfinConnectState } from './models/JellyfinConnectState.ts';
import { toLibraryChoice } from './toLibraryChoice.ts';

const POLL_INTERVAL = time.seconds(2);
const FALLBACK_EXPIRY = time.minutes(10);
const EXPIRED_ERRORS = new Set(['attempt_expired', 'attempt_not_found']);

type AuthenticatedJellyfin = Extract<JellyfinAuth, { status: 'authenticated' }>;

export function useJellyfinConnect({
  onConnected,
}: {
  onConnected: () => void;
}) {
  const state = new BehaviorSubject<JellyfinConnectState>({ step: 'idle' });
  let pollTimer: ReturnType<typeof setTimeout> | undefined;
  let latestAttempt = 0;

  const create = useMutation(
    defineMutation({
      key: 'media-sync:create-connection',
      request: createMediaSyncConnectionRequest,
      invalidations: [InvalidateAction.MediaSync.Connections],
    }),
  );

  function stopPolling() {
    clearTimeout(pollTimer);
    pollTimer = undefined;
  }

  onDestroy(() => {
    stopPolling();
    state.complete();
  });

  function choose(auth: AuthenticatedJellyfin) {
    state.next({
      step: 'choosing',
      attemptId: auth.attemptId,
      serverName: auth.serverName,
      libraries: auth.libraries,
      libraryIds: auth.libraries.map((library) => library.externalId),
      feeds: [...JELLYFIN_FEEDS],
      importHistory: true,
    });
  }

  function isWaitingOn(attemptId: string) {
    const current = state.value;
    return current.step === 'waiting' && current.attemptId === attemptId;
  }

  async function poll(attemptId: string, deadline: number) {
    if (!isWaitingOn(attemptId)) return;

    if (Date.now() > deadline) {
      state.next({ step: 'expired' });
      return;
    }

    const result = await jellyfinQuickConnectRequest({ attemptId }).catch(
      () => null,
    );
    if (!isWaitingOn(attemptId)) return;

    if (result?.ok && result.value.status === 'authenticated') {
      choose(result.value);
      return;
    }

    if (result && !result.ok && EXPIRED_ERRORS.has(result.error)) {
      state.next({ step: 'expired' });
      return;
    }

    pollTimer = setTimeout(() => poll(attemptId, deadline), POLL_INTERVAL);
  }

  function start() {
    latestAttempt += 1;
    stopPolling();
    state.next({ step: 'signing-in', isSubmitting: false, error: null });
  }

  async function signIn(credentials: JellyfinSignIn) {
    const current = state.value;
    if (current.step !== 'signing-in' || current.isSubmitting) return;

    const attempt = ++latestAttempt;
    state.next({ step: 'signing-in', isSubmitting: true, error: null });

    const result = await jellyfinAuthRequest({ signIn: credentials }).catch(
      () => null,
    );
    if (attempt !== latestAttempt) return;

    if (!result?.ok) {
      state.next({
        step: 'signing-in',
        isSubmitting: false,
        error: result?.error ?? 'sign_in_failed',
      });
      return;
    }

    const auth = result.value;
    if (auth.status === 'authenticated') {
      choose(auth);
      return;
    }

    state.next({
      step: 'waiting',
      attemptId: auth.attemptId,
      code: auth.code,
      serverName: auth.serverName,
    });
    const expiresIn =
      auth.expiresIn == null ? FALLBACK_EXPIRY : time.seconds(auth.expiresIn);
    poll(auth.attemptId, Date.now() + expiresIn);
  }

  function toggleFeed(feed: MediaSyncFeed) {
    const current = state.value;
    if (current.step !== 'choosing') return;

    state.next({
      ...current,
      feeds: current.feeds.includes(feed)
        ? current.feeds.filter((chosen) => chosen !== feed)
        : [...current.feeds, feed],
    });
  }

  function chooseImportHistory(importHistory: boolean) {
    const current = state.value;
    if (current.step !== 'choosing') return;

    state.next({ ...current, importHistory });
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
    if (current.step !== 'choosing') return;

    state.next({ step: 'connecting' });

    const result = await create
      .mutate({
        provider: 'jellyfin',
        attemptId: current.attemptId,
        libraryIds: current.libraryIds,
        feeds: current.feeds,
        importHistory: current.importHistory,
      })
      .catch(() => null);

    if (!result?.ok) {
      state.next({ step: 'failed', error: result?.error ?? 'connect_failed' });
      return;
    }

    state.next({ step: 'idle' });
    onConnected();
  }

  function cancel() {
    latestAttempt += 1;
    stopPolling();
    state.next({ step: 'idle' });
  }

  return {
    state: state.asObservable(),
    start,
    signIn,
    toggleFeed,
    chooseImportHistory,
    toggleLibrary,
    connect,
    cancel,
  };
}
