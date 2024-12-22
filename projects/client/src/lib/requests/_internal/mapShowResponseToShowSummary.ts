import { type ShowResponse } from '$lib/api.ts';
import { mediumUrl } from '$lib/requests/_internal/mediumUrl.ts';
import { thumbUrl } from '$lib/requests/_internal/thumbUrl.ts';
import type { ShowSummary } from '$lib/requests/models/ShowSummary.ts';
import {
  DEFAULT_TRAILER,
  MAX_DATE,
  MEDIA_POSTER_PLACEHOLDER,
} from '$lib/utils/constants.ts';
import { findDefined } from '$lib/utils/string/findDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';

export function mapShowResponseToShowSummary(
  show: ShowResponse,
): ShowSummary {
  const thumbCandidate = findDefined(
    show.images?.thumb.at(1),
    show.images?.thumb.at(0),
  );

  const coverCandidate = findDefined(
    show.images?.fanart.at(1),
    show.images?.fanart.at(0),
  );

  const posterCandidate = findDefined(
    show.images?.poster.at(1),
    show.images?.poster.at(0),
  );

  return {
    id: show.ids.trakt,
    slug: show.ids.slug,
    title: show.title,
    runtime: show.runtime!,
    year: show.year,
    tagline: show.tagline!,
    country: show.country,
    languages: show.languages,
    poster: {
      url: {
        medium: prependHttps(
          mediumUrl(posterCandidate),
          MEDIA_POSTER_PLACEHOLDER,
        ),
        thumb: prependHttps(
          thumbUrl(posterCandidate),
          MEDIA_POSTER_PLACEHOLDER,
        ),
      },
    },
    cover: {
      url: {
        medium: prependHttps(
          mediumUrl(coverCandidate),
          MEDIA_POSTER_PLACEHOLDER,
        ),
        thumb: prependHttps(
          findDefined(
            thumbCandidate,
            thumbUrl(coverCandidate),
          ),
          MEDIA_POSTER_PLACEHOLDER,
        ),
      },
    },
    thumb: {
      url: prependHttps(
        thumbCandidate,
        MEDIA_POSTER_PLACEHOLDER,
      ),
    },
    genres: show.genres ?? [],
    overview: show.overview ?? 'TBD',
    trailer: prependHttps(
      show.trailer,
      DEFAULT_TRAILER,
    ),
    airedDate: new Date(show.first_aired ?? MAX_DATE),
    certification: show.certification,
  };
}
