import { type ShowResponse } from '$lib/api.ts';
import type { ShowSummary } from '$lib/requests/models/ShowSummary.ts';
import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/constants.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';

export function mapShowResponseToShowSummary(
  show: ShowResponse,
): ShowSummary {
  const thumbCandidate = findDefined(
    show.images?.thumb.at(1),
    show.images?.thumb.at(0),
  );

  const fanArtCandidate = findDefined(
    show.images?.fanart.at(1),
    show.images?.fanart.at(0),
  )?.replace('/medium/', '/thumb/');

  const posterCandidate = findDefined(
    show.images?.poster.at(1),
    show.images?.poster.at(0),
  )?.replace('/medium/', '/thumb/');

  return {
    id: show.ids.trakt,
    slug: show.ids.slug,
    title: show.title,
    runtime: show.runtime!,
    tagline: show.tagline!,
    poster: {
      url: prependHttps(
        posterCandidate,
        MEDIA_POSTER_PLACEHOLDER,
      ),
    },
    cover: {
      url: prependHttps(
        findDefined(
          thumbCandidate,
          fanArtCandidate,
        ),
        MEDIA_POSTER_PLACEHOLDER,
      ),
    },
    genres: show.genres ?? [],
    overview: show.overview ?? 'TBD',
    trailer: show.trailer,
  };
}
