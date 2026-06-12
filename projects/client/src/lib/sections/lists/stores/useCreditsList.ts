import { makeTargets } from '$lib/features/intl-overlay/makeTargets.ts';
import { withBulkIntlOverlay } from '$lib/features/intl-overlay/withBulkIntlOverlay.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { CrewPosition } from '$lib/requests/models/CrewPosition.ts';
import type {
  MediaCredit,
  MediaCredits,
} from '$lib/requests/models/MediaCredits.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { personMovieCreditsQuery } from '$lib/requests/queries/people/personMovieCreditsQuery.ts';
import { personShowCreditsQuery } from '$lib/requests/queries/people/personShowCreditsQuery.ts';
import { combineLatest, map } from 'rxjs';

type UseCreditsListProps = {
  type: MediaType;
  slug: string;
};

function typeToQuery(
  { type, slug }: UseCreditsListProps,
) {
  const params = { slug };

  switch (type) {
    case 'movie':
      return personMovieCreditsQuery(params);
    case 'show':
      return personShowCreditsQuery(params);
  }
}

function flattenCredits(
  credits: MediaCredits | undefined,
): FlatCredit[] {
  if (!credits) return [];
  const flat: FlatCredit[] = [];
  for (const [position, list] of credits.entries()) {
    for (const credit of list) {
      flat.push({ position, credit });
    }
  }
  return flat;
}

type FlatCredit = { position: CrewPosition; credit: MediaCredit };

const flatCreditTargets = makeTargets<FlatCredit>({
  get: (entry) => ({
    id: entry.credit.media.id,
    type: entry.credit.media.type,
  }),
  patch: (entry, title) => ({
    ...entry,
    credit: {
      ...entry.credit,
      media: { ...entry.credit.media, title },
    } as typeof entry.credit,
  }),
});

function rebuildCredits(
  source: MediaCredits | undefined,
  localized: FlatCredit[],
): MediaCredits {
  const grouped = new Map<CrewPosition, MediaCredit[]>();
  for (const position of source?.keys() ?? []) {
    grouped.set(position, []);
  }
  for (const { position, credit } of localized) {
    const bucket = grouped.get(position) ?? [];
    bucket.push(credit);
    grouped.set(position, bucket);
  }
  return grouped;
}

export function useCreditsList(
  { type, slug }: UseCreditsListProps,
) {
  const query = useQuery(typeToQuery({ type, slug }));

  const flatCredits = query.pipe(
    map(($query) => flattenCredits($query.data)),
    withBulkIntlOverlay({ getTargets: flatCreditTargets }),
  );

  const credits = combineLatest([query, flatCredits]).pipe(
    map(([$query, $flat]) => rebuildCredits($query.data, $flat)),
  );

  return {
    credits,
    positions: query.pipe(
      map(($query) => {
        if (!$query.data) return [];
        return Array.from($query.data.keys());
      }),
    ),
  };
}
