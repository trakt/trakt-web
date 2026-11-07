import * as m from '$lib/features/i18n/messages.ts';
import type { HypeReasons } from '$lib/requests/models/HypeReasons.ts';
import type { MatchKind } from '$lib/requests/models/MatchKind.ts';
import type { MatchTaste } from '$lib/requests/models/MatchTaste.ts';
import { toPercentage } from '$lib/utils/formatting/number/toPercentage.ts';
import { LIKED_ON_TRAKT } from './constants/likedOnTrakt.ts';

const MAX_GENRES = 2;

type MatchHeadlineParams = {
  kind: MatchKind;
  reasons: HypeReasons | null;
  taste: MatchTaste[];
  rating: number | null | undefined;
  votes: number;
  locale: string;
};

function seriesLine(reasons: HypeReasons | null): string | null {
  const films = reasons?.series?.films ?? [];
  if (films.length === 0) return null;

  const favorite = films.reduce((best, film) =>
    film.stars >= best.stars ? film : best,
  );
  return m.text_headline_series_rated({
    title: favorite.title,
    stars: favorite.stars,
  });
}

function tasteLine(taste: MatchTaste[], locale: string): string | null {
  const labels = taste.slice(0, MAX_GENRES).map(({ label }) => label);
  if (labels.length === 0) return null;
  if (labels.length === 1) return m.text_headline_genre({ genre: labels[0] });

  return m.text_headline_genres({
    genres: new Intl.ListFormat(locale, { type: 'conjunction' }).format(labels),
  });
}

function listsLine(reasons: HypeReasons | null): string | null {
  return reasons?.lists ? m.text_headline_lists() : null;
}

function ratingLine({
  rating,
  votes,
  locale,
}: Pick<MatchHeadlineParams, 'rating' | 'votes' | 'locale'>): string | null {
  if (rating == null) return null;
  if (votes < LIKED_ON_TRAKT.minVotes || rating < LIKED_ON_TRAKT.from) {
    return null;
  }
  return m.text_headline_rating({ percent: toPercentage(rating, locale) });
}

export function matchHeadline(params: MatchHeadlineParams): string | null {
  const { kind, reasons, taste, locale } = params;

  if (kind === 'hype') {
    return (
      seriesLine(reasons) ?? tasteLine(taste, locale) ?? listsLine(reasons)
    );
  }

  return tasteLine(taste, locale) ?? ratingLine(params);
}
