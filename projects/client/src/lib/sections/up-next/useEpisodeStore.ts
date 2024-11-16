import type { EpisodeEntry } from '$lib/requests/calendars/upcomingEpisodes.ts';
import { readonly, writable } from 'svelte/store';

export const useEpisodeStore = <T extends EpisodeEntry>() => {
  const episodes = writable<T[]>([]);

  const set = (update: T[]) => {
    episodes.update((previous) => {
      const updatedEpisodes = previous.filter(
        (prevEpisode) =>
          update.some((newEpisode) =>
            newEpisode.show.id === prevEpisode.show.id
          ),
      );

      update.forEach((newEpisode) => {
        const index = updatedEpisodes.findIndex((ep) =>
          ep.show.id === newEpisode.show.id
        );

        if (index !== -1) {
          updatedEpisodes[index] = newEpisode;
        } else {
          updatedEpisodes.push(newEpisode);
        }
      });

      return updatedEpisodes;
    });
  };

  return {
    value: readonly(episodes),
    set,
  };
};
