import { type ShowResponse } from '$lib/api.ts';
import type { ShowSummary } from '$lib/requests/models/ShowSummary.ts';
import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/constants.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';

export function mapShowResponseToShowSummary(
  show: ShowResponse,
): ShowSummary {
  return {
    id: show.ids.trakt,
    slug: show.ids.slug,
    title: show.title,
    runtime: show.runtime!,
    tagline: show.tagline!,
    poster: {
      url: prependHttps(
        show.images?.poster.at(1) ??
          show.images?.poster.at(0),
        MEDIA_POSTER_PLACEHOLDER,
      ),
    },
    cover: {
      url: prependHttps(
        show.images?.fanart.at(1) ??
          show.images?.fanart.at(0),
        MEDIA_POSTER_PLACEHOLDER,
      ),
    },
    genres: show.genres ?? [],
    overview: show.overview ?? 'TBD',
    trailer: show.trailer,
  };
}
