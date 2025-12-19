import type { MediaType } from '../models/MediaType.ts';
import { createSearcher } from './createSearcher.ts';
import type { MovieSchema } from './schema/MovieSchema.ts';
import type { PersonSchema } from './schema/PersonSchema.ts';
import type { ShowSchema } from './schema/ShowSchema.ts';

export type SearchCategory = MediaType | 'person';

type SchemaForCategory<T extends SearchCategory> = T extends 'movie'
  ? MovieSchema
  : T extends 'show' ? ShowSchema
  : T extends 'person' ? PersonSchema
  : never;

type SearchParams<T extends SearchCategory> = {
  key: string;
  server: string;
  query: string;
  limit: number;
  types: T[];
  exact: boolean;
};

const COLLECTION_MAP: Record<SearchCategory, string> = {
  movie: 'Movie',
  show: 'Show',
  person: 'Person',
};

const PRESET_MAP: Record<SearchCategory, string> = {
  movie: 'search:media',
  show: 'search:media',
  person: 'search:people',
};

const EXACT_PRESET_MAP: Record<SearchCategory, string> = {
  movie: 'search:media:exact',
  show: 'search:media:exact',
  person: 'search:people',
};

export function lookup<T extends SearchCategory>({
  key,
  server,
  query: q,
  limit,
  types,
  exact,
}: SearchParams<T>) {
  const targetPresetMap = exact ? EXACT_PRESET_MAP : PRESET_MAP;

  return createSearcher({
    key,
    server,
  })
    .multiSearch
    .perform<SchemaForCategory<T>[]>({
      searches: types.map((type) => ({
        collection: COLLECTION_MAP[type],
        preset: targetPresetMap[type],
      })),
      union: true,
    }, {
      q,
      limit,
    })
    .then(({ hits, found }) => ({
      hits: hits ?? [],
      total: found,
    }));
}
