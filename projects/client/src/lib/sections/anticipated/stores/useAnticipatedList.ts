import type { MediaType } from '$lib/models/MediaType.ts';
import {
  type AnticipatedMovie,
  movieAnticipatedQuery,
} from '$lib/requests/queries/movies/movieAnticipatedQuery.ts';
import { showAnticipatedQuery } from '$lib/requests/queries/shows/showAnticipatedQuery.ts';
import { createQuery, type CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';

export type AnticipatedMediaItem = AnticipatedMovie;
export type AnticipatedMedia = Array<AnticipatedMediaItem>;

const ANTICIPATED_LIMIT = 25;

type AnticipatedListStoreProps = {
  type: MediaType;
};

function typeToQuery(type: MediaType): CreateQueryOptions<AnticipatedMedia> {
  const params = {
    limit: ANTICIPATED_LIMIT,
  };

  switch (type) {
    case 'movie':
      return movieAnticipatedQuery(params);
    case 'show':
      return showAnticipatedQuery(params);
    case 'episode':
      throw new Error('Not implemented');
  }
}

export function useAnticipatedList(
  { type }: AnticipatedListStoreProps,
) {
  const query = createQuery(typeToQuery(type));
  const list = derived(query, ($query) => $query.data ?? []);

  return {
    list,
  };
}
