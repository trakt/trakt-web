import type { ListItem } from '$lib/requests/models/ListItem.ts';
import { ListedMoviesMappedMock } from '$mocks/data/lists/mapped/ListedMoviesMappedMock.ts';
import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { describe, expect, it } from 'vitest';
import type { ReorderableListItem } from './models/ReorderableListItem.ts';
import {
  itemOrderSignature,
  listItemRankIds,
  mapListItemToReorderableItem,
  sortReorderableItems,
} from './reorderListItems.ts';

const items: ReorderableListItem[] = [
  {
    key: 'show-2',
    listItemId: 202,
    rank: 2,
    title: 'Second',
  },
  {
    key: 'movie-1',
    listItemId: 101,
    rank: 1,
    title: 'First',
  },
  {
    key: 'episode-3',
    listItemId: 303,
    rank: 3,
    title: 'Third',
  },
];

describe('reorderListItems', () => {
  it('should sort reorderable items by rank', () => {
    const result = sortReorderableItems(items);

    expect(itemOrderSignature(result)).toBe('movie-1|show-2|episode-3');
  });

  it('should build list item rank ids in the current order', () => {
    const result = listItemRankIds(items);

    expect(result).toEqual([202, 101, 303]);
  });

  it('should not mutate the input when sorting', () => {
    sortReorderableItems(items);

    expect(itemOrderSignature(items)).toBe('show-2|movie-1|episode-3');
  });

  describe('mapListItemToReorderableItem', () => {
    const base = { id: 7, key: 'item-7', rank: 4, listedAt: new Date() };

    it('should use the release year as subtitle for movies', () => {
      const [movie] = ListedMoviesMappedMock;
      const result = mapListItemToReorderableItem(movie as ListItem);

      expect(result.title).toBe('Heretic');
      expect(result.subtitle).toBe('2024');
      expect(result.listItemId).toBe(1146014560);
      expect(result.rank).toBe(1);
    });

    it('should label seasons and prefer the season poster', () => {
      const posterUrl = 'https://media.trakt.tv/seasons/1/thumb/poster.webp';
      const result = mapListItemToReorderableItem({
        ...base,
        type: 'season',
        entry: {
          show: ShowSiloMappedMock,
          season: {
            id: 1,
            key: 'season-1',
            number: 2,
            episodes: { count: 10, aired: 10 },
            poster: { url: { medium: posterUrl, thumb: posterUrl } },
            airDate: new Date(),
            totalRuntime: 600,
          },
        },
      });

      expect(result.title).toBe(ShowSiloMappedMock.title);
      expect(result.subtitle).toBe('Season 2');
      expect(result.posterUrl).toBe(posterUrl);
    });

    it('should fall back to the show poster for seasons without one', () => {
      const result = mapListItemToReorderableItem({
        ...base,
        type: 'season',
        entry: {
          show: ShowSiloMappedMock,
          season: {
            id: 1,
            key: 'season-0',
            number: 0,
            episodes: { count: 3, aired: 3 },
            airDate: new Date(),
            totalRuntime: 60,
          },
        },
      });

      expect(result.subtitle).toBe('Specials');
      expect(result.posterUrl).toBe(ShowSiloMappedMock.poster.url.thumb);
    });

    it('should combine the episode number and title for episodes', () => {
      const result = mapListItemToReorderableItem({
        ...base,
        type: 'episode',
        entry: { show: ShowSiloMappedMock, episode: EpisodeSiloMappedMock },
      });

      expect(result.title).toBe(ShowSiloMappedMock.title);
      expect(result.subtitle).toContain(EpisodeSiloMappedMock.title);
      expect(result.subtitle).toContain(' - ');
      expect(result.posterUrl).toBe(ShowSiloMappedMock.poster.url.thumb);
    });
  });
});
