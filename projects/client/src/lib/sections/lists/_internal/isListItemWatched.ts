import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import type { ListItem } from '$lib/requests/models/ListItem.ts';
import { countWatchedEpisodes } from '$lib/utils/media/countWatchedEpisodes.ts';

export function isListItemWatched(
  item: ListItem,
  history: UserHistory,
): boolean {
  switch (item.type) {
    case 'movie':
      return history.movies.has(item.entry.id);
    case 'show': {
      const watchedShow = history.shows.get(item.entry.id);
      const totalEpisodes = item.entry.episode.count;
      if (!watchedShow || totalEpisodes === 0) return false;
      return countWatchedEpisodes(watchedShow.playsPerSeason) >= totalEpisodes;
    }
    case 'season': {
      const { show, season } = item.entry;
      const watchedShow = history.shows.get(show.id);
      if (!watchedShow || season.episodes.count === 0) return false;
      const watchedInSeason = watchedShow.playsPerSeason.get(season.number) ??
        0;
      return watchedInSeason >= season.episodes.count;
    }
    case 'episode': {
      const { show, episode } = item.entry;
      const watchedShow = history.shows.get(show.id);
      return watchedShow?.episodes.some(
        (e) => e.episodeId === episode.id,
      ) ?? false;
    }
  }
}
