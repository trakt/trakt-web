import { unixToDateTime } from '../../../../utils/date/unixToDateTime.ts';
import { prependHttps } from '../../../../utils/url/prependHttps.ts';
import type { MovieSchema } from '../../../search/schema/MovieSchema.ts';
import type { ShowSchema } from '../../../search/schema/ShowSchema.ts';
import { toIds } from './toIds.ts';
import { toImageArray } from './toImageArray.ts';

export function toCommonMedia(input: ShowSchema | MovieSchema) {
  return {
    title: input.title,
    year: input.year,
    ids: toIds(input),
    tagline: input.tagline,
    overview: input.overview,
    runtime: input.runtime,
    country: input.country,
    trailer: prependHttps(input.trailer),
    homepage: prependHttps(input.homepage),
    status: input.status,
    rating: input.rating,
    votes: input.votes,
    comment_count: input.comment_count,
    updated_at: unixToDateTime(input.updated_at),
    language: input.default_language,
    languages: input.spoken_languages,
    available_translations: input.available_translations,
    genres: input.genre_slugs,
    subgenres: input.subgenre_slugs,
    original_title: input.original_title,
    images: {
      fanart: toImageArray(input.fanart_url),
      poster: toImageArray(input.poster_url),
      logo: toImageArray(input.logo_url),
      banner: toImageArray(input.banner_url),
      thumb: toImageArray(input.thumb_url),
      clearart: toImageArray(input.clearart_url),
    },
    colors: {
      poster: input.poster_gradient,
    },
  };
}
