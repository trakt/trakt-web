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
};

const COLLECTION_MAP: Record<SearchCategory, string> = {
  movie: 'Movie',
  show: 'Show',
  person: 'Person',
};

export function lookup<T extends SearchCategory>({
  key,
  server,
  query: q,
  limit,
  types,
}: SearchParams<T>) {
  return createSearcher({
    key,
    server,
  })
    .multiSearch
    .perform<SchemaForCategory<T>[]>({
      searches: types.map((type) => ({
        collection: COLLECTION_MAP[type],
      })),
      union: true,
    }, {
      q,
      prioritize_exact_match: false,
      limit,
    })
    .then(({ hits, found }) => ({
      hits: hits ?? [],
      total: found,
    }));
}
