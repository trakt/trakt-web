import type { WatchAction } from '$lib/api.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import * as m from '$lib/features/i18n/messages.ts';
import type { EpisodeEntry } from '$lib/requests/queries/calendars/upcomingEpisodesQuery.ts';
import { markAsWatchedRequest } from '$lib/requests/sync/markAsWatchedRequest.ts';
import { SvelteMap } from 'svelte/reactivity';

export function resolveWatchDate(
  action: WatchAction | undefined,
  airedDate: Date,
) {
  const now = new Date().toISOString();

  switch (action) {
    case 'released':
      return airedDate.toISOString();
    case 'ask':
      return prompt(
        m.mark_as_watched_ask_prompt(),
        now,
      ) ?? undefined;
    case 'now':
    default:
      return now;
  }
}

export function useMarkAsWatched() {
  const episodeLoadingMap = new SvelteMap<number, boolean>();

  const isLoading = (id: number) => episodeLoadingMap.get(id) ?? false;
  const { current: user } = useUser();

  const markAsWatched = async ({ id, airedDate }: EpisodeEntry) => {
    const watchedAtDate = resolveWatchDate(
      user().preferences.watch.action,
      airedDate,
    );
    episodeLoadingMap.set(id, true);
    await markAsWatchedRequest({
      body: {
        episodes: [
          {
            ids: { trakt: id },
            watched_at: watchedAtDate,
          },
        ],
      },
    });
    episodeLoadingMap.set(id, false);
  };

  return {
    markAsWatched,
    isLoading,
  };
}
