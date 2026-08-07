import * as m from '$lib/features/i18n/messages.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import type { PersonStat } from './PersonStat.ts';
import type { PersonCreditCounts } from './usePersonCreditCounts.ts';

type MapToPersonStatsProps = {
  slug: string;
  credits: PersonCreditCounts | Nil;
};

/**
 * How much of a person's work there is, as two linked stats.
 *
 * Kept apart from `mapToPersonFacts` because these are a different kind of thing.
 * Height, birth date and age describe the person; these count their work. Joined
 * into one run they read as five interchangeable items and the row turns to
 * clutter, so they get their own line, a label above a figure, and a destination.
 *
 * Both drilldowns already exist - the credit lists further down the page link to
 * the same two routes - so these are real links rather than a placeholder.
 *
 * A count of zero is dropped rather than shown: "0 shows" is noise, not
 * information, and a link to an empty page is worse than no link.
 */
export function mapToPersonStats(
  { slug, credits }: MapToPersonStatsProps,
): ReadonlyArray<PersonStat> {
  if (!credits || credits.isLoading) {
    return [];
  }

  const stats: PersonStat[] = [];

  if (credits.movies > 0) {
    stats.push({
      key: 'movies',
      label: m.list_title_movie_credits(),
      value: credits.movies.toString(),
      href: UrlBuilder.credits.movies(slug),
    });
  }

  if (credits.shows > 0) {
    stats.push({
      key: 'shows',
      label: m.list_title_show_credits(),
      value: credits.shows.toString(),
      href: UrlBuilder.credits.shows(slug),
    });
  }

  return stats;
}
