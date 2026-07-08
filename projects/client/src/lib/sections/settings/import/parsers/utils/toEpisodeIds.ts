import type { ImportIds } from '../../ImportTypes.ts';

type EpisodeKeys = {
  tvdbId?: number;
  showTvdb?: number;
  showImdb?: string;
  season?: number;
  episode?: number;
};

// The id fields for an imported episode, or null when it can't be resolved. An
// episode resolves by its own TVDB id or, when Trakt has none for it, by a
// positional key (show id + season + episode number).
export function toEpisodeIds(
  { tvdbId, showTvdb, showImdb, season, episode }: EpisodeKeys,
): ImportIds | null {
  const hasShow = showTvdb != null || showImdb != null;
  const hasPositional = hasShow && season != null && episode != null;
  if (tvdbId == null && !hasPositional) return null;
  return tvdbId != null ? { tvdb: tvdbId } : {};
}
