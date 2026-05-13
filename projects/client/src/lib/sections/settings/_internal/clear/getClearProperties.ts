import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { ClearSource } from './models/ClearSource.ts';

function getTotalCount(source: ClearSource) {
  if (!source.input) {
    return 0;
  }

  switch (source.type) {
    case 'watchlist':
      return source.input.movies.size + source.input.shows.size;
    case 'ratings':
      return (
        source.input.movies.size +
        source.input.shows.size +
        source.input.episodes.size
      );
    case 'history':
      return source.input.movies.size + source.input.shows.size;
  }
}

function getInvalidations(source: ClearSource) {
  switch (source.type) {
    case 'watchlist':
      return [
        InvalidateAction.Watchlisted('movie'),
        InvalidateAction.Watchlisted('show'),
      ];
    case 'ratings':
      return [
        InvalidateAction.Rated('movie'),
        InvalidateAction.Rated('show'),
        InvalidateAction.Rated('episode'),
      ];
    case 'history':
      return [
        InvalidateAction.MarkAsWatched('movie'),
        InvalidateAction.MarkAsWatched('show'),
        InvalidateAction.MarkAsWatched('episode'),
      ];
  }
}

export function getClearProperties(source: ClearSource) {
  return {
    totalCount: getTotalCount(source),
    invalidations: getInvalidations(source),
  };
}
