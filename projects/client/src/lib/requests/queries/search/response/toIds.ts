import type { MovieSchema } from '../../../search/schema/MovieSchema.ts';
import type { PersonSchema } from '../../../search/schema/PersonSchema.ts';
import type { ShowSchema } from '../../../search/schema/ShowSchema.ts';

const EMPTY_PLEX_ID = Object.freeze({
  plex: Object.freeze({
    guid: undefined,
    slug: undefined,
  }),
});

function toPlexId(input: Partial<MovieSchema | ShowSchema>) {
  if (input.plex_guid == null) return EMPTY_PLEX_ID;
  if (input.plex_slug == null) return EMPTY_PLEX_ID;

  return {
    plex: {
      guid: input.plex_guid,
      slug: input.plex_slug,
    },
  };
}

export function toIds(input: MovieSchema | PersonSchema | ShowSchema) {
  return {
    trakt: parseInt(input.id, 10),
    slug: input.slug,
    imdb: input.imdb_id,
    tmdb: input.tmdb_id,
    ...toPlexId(input),
  };
}
