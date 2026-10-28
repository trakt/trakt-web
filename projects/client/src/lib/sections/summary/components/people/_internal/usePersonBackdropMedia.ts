import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaCredits } from '$lib/requests/models/MediaCredits.ts';
import { personMovieCreditsQuery } from '$lib/requests/queries/people/personMovieCreditsQuery.ts';
import { map, type Observable } from 'rxjs';

/**
 * The title whose artwork stands in as a person's backdrop.
 *
 * A person carries no artwork of their own - `PersonSummary` has a headshot and
 * nothing else - but their credits carry whole `MediaEntry`s, which do have the
 * same 16:9 cover art the title masthead uses. So the backdrop is borrowed from
 * the title they are best known for.
 *
 * Film credits only, deliberately: film fanart is shot and graded as key art,
 * where a show's is often an episodic still or a cast composite that reads badly
 * blown up behind a portrait.
 *
 * "Best known for" is approximated by vote count, which is the only popularity
 * signal on the entry. It is a proxy - a person's most-voted film is not always
 * the one they are famous for - but it is stable, needs no extra request, and is
 * the same signal the rest of the app ranks by.
 */
function pickBackdrop(credits: MediaCredits | undefined): MediaEntry | null {
  if (!credits) {
    return null;
  }

  const entries = Array.from(credits.values())
    .flat()
    .map((credit) => credit.media)
    .filter((media) => Boolean(media.cover.url.medium));

  if (entries.length === 0) {
    return null;
  }

  return entries.reduce((best, media) =>
    media.votes > best.votes ? media : best
  );
}

export function usePersonBackdropMedia(slug$: Observable<string>) {
  const query = useQuery(
    slug$.pipe(
      map((slug) => personMovieCreditsQuery({ slug, filter: {} })),
    ),
  );

  return query.pipe(map(($query) => pickBackdrop($query.data)));
}
