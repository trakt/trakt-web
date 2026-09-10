import { getLocale } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaParentalGuide as Guide } from '$lib/requests/models/MediaParentalGuide.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { mediaParentalGuideQuery } from '$lib/requests/queries/media/mediaParentalGuideQuery.ts';
import { isShallowEqual } from '$lib/utils/object/isShallowEqual.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { distinctUntilChanged, map, type Observable } from 'rxjs';

type DisplayableCategory = {
  key: string;
  label: string;
  severityLabel: string;
  severityProgress: number;
  severityTone: SeverityTone;
  signals: ReadonlyArray<{
    key: SignalTone;
    label: string;
    count: number;
  }>;
};

type GuideEntry = Guide['guide'][number];
type GuideCategory = GuideEntry['category'];
type GuideSeverity = GuideEntry['severity'];
type SignalTone = Lowercase<GuideSeverity>;
type SeverityTone = SignalTone | 'unknown';

type ParentalGuideTarget = {
  type: MediaType;
  slug: string;
};

// Declaration order is render order: category rows, then signal breakdown.
const CATEGORY_LABEL = {
  NUDITY: m.label_parental_guide_category_nudity,
  VIOLENCE: m.label_parental_guide_category_violence,
  PROFANITY: m.label_parental_guide_category_profanity,
  ALCOHOL: m.label_parental_guide_category_alcohol,
  FRIGHTENING: m.label_parental_guide_category_frightening,
} as const satisfies Record<GuideCategory, () => string>;

const SEVERITY = {
  NONE: {
    tone: 'none',
    label: m.label_parental_guide_severity_none,
    progress: 0.1,
  },
  MILD: {
    tone: 'mild',
    label: m.label_parental_guide_severity_mild,
    progress: 0.3,
  },
  MODERATE: {
    tone: 'moderate',
    label: m.label_parental_guide_severity_moderate,
    progress: 0.6,
  },
  SEVERE: {
    tone: 'severe',
    label: m.label_parental_guide_severity_severe,
    progress: 0.9,
  },
} as const satisfies Record<
  GuideSeverity,
  { tone: SignalTone; label: () => string; progress: number }
>;

function toDisplayableCategories(
  parentalGuide: Guide | null | undefined,
): DisplayableCategory[] {
  return Object.entries(CATEGORY_LABEL).map(([category, toCategoryLabel]) => {
    const entry = parentalGuide?.guide.find((item) =>
      item.category === category
    );

    if (!entry) {
      return {
        key: category,
        label: toCategoryLabel(),
        severityLabel: m.text_unknown(),
        severityProgress: 0,
        severityTone: 'unknown',
        signals: [],
      };
    }

    const severity = SEVERITY[entry.severity];

    return {
      key: category,
      label: toCategoryLabel(),
      severityLabel: severity.label(),
      severityProgress: severity.progress,
      severityTone: severity.tone,
      signals: Object.values(SEVERITY).map(({ tone, label }) => ({
        key: tone,
        label: label(),
        count: entry.signals[tone],
      })),
    };
  });
}

export function useParentalGuideCategories(
  { target$ }: { target$: Observable<ParentalGuideTarget> },
) {
  const query = useQuery(
    target$.pipe(
      distinctUntilChanged(isShallowEqual),
      map(({ type, slug }) =>
        mediaParentalGuideQuery({ type, slug, locale: getLocale() })
      ),
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
