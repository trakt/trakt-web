import { type ShowResponse } from '$lib/api.ts';
import type { ShowSummary } from '$lib/requests/models/ShowSummary.ts';
import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/constants.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';

export function mapShowResponseToShowSummary(
  show: ShowResponse,
): ShowSummary {
  const fanart = findDefined(
    show.images?.fanart.at(1),
    show.images?.fanart.at(0),
  );

  return {
    id: show.ids.trakt,
    slug: show.ids.slug,
    title: show.title,
    runtime: show.runtime!,
    tagline: show.tagline!,
    poster: {
      url: prependHttps(
        findDefined(
          show.images?.poster.at(1),
          show.images?.poster.at(0),
        ),
        MEDIA_POSTER_PLACEHOLDER,
      )?.replace('/medium/', '/thumb/'),
    },
    cover: {
      url: prependHttps(
        fanart,
        MEDIA_POSTER_PLACEHOLDER,
      ),
    },
    thumb: {
      url: prependHttps(
        findDefined(
          show.images?.thumb.at(1),
          show.images?.thumb.at(0),
          fanart,
        ),
        MEDIA_POSTER_PLACEHOLDER,
      ),
    },
    genres: show.genres ?? [],
    overview: show.overview ?? 'TBD',
    trailer: show.trailer,
  };
}
