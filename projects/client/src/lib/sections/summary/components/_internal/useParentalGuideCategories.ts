import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaParentalGuide as Guide } from '$lib/requests/models/MediaParentalGuide.ts';
import { mediaParentalGuideQuery } from '$lib/requests/queries/media/mediaParentalGuideQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { distinctUntilChanged, map, type Observable } from 'rxjs';

type SeverityTone = 'none' | 'mild' | 'moderate' | 'severe' | 'unknown';

type DisplayableCategory = {
  key: string;
  label: string;
  severityLabel: string;
  severityTone: SeverityTone;
};

const CATEGORY_ORDER = [
  'sex_nudity',
  'violence_gore',
  'profanity',
  'alcohol_drugs_smoking',
  'frightening_intense_scenes',
];

function toSeverityTone(severity: string): SeverityTone {
  switch (severity.toUpperCase()) {
    case 'NONE':
      return 'none';
    case 'MILD':
      return 'mild';
    case 'MODERATE':
      return 'moderate';
    case 'SEVERE':
      return 'severe';
    default:
      return 'unknown';
  }
}

function toDisplayableSeverity(severity: string): string {
  return severity
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function categoryRank(key: string): number {
  const index = CATEGORY_ORDER.indexOf(key);
  return index === -1 ? CATEGORY_ORDER.length : index;
}

function toDisplayableCategories(
  parentalGuide: Guide | null | undefined,
): DisplayableCategory[] {
  return Object.entries(parentalGuide?.categories ?? {})
    .filter(([, category]) => category.label.length > 0)
    .sort(([keyA], [keyB]) => categoryRank(keyA) - categoryRank(keyB))
    .map(([key, category]) => ({
      key,
      label: category.label,
      severityLabel: category.severityLabel ??
        toDisplayableSeverity(category.severity),
      severityTone: toSeverityTone(category.severity),
    }));
}

export function useParentalGuideCategories(
  { imdbId$ }: { imdbId$: Observable<string | null | undefined> },
) {
  const query = useQuery(
    imdbId$.pipe(
      distinctUntilChanged(),
      map((imdbId) => mediaParentalGuideQuery({ imdbId })),
    ),
  );

  return {
    categories: query.pipe(
      map(($query) => toDisplayableCategories($query.data)),
    ),
    isError: query.pipe(map(($query) => $query.isError)),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
