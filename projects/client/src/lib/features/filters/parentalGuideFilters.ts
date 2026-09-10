import * as m from '$lib/features/i18n/messages.ts';
import { FilterKey, type RatingsFilter } from './models/Filter.ts';
import type { SliderOption } from './models/FilterOptions.ts';

const severities = [
  m.label_parental_guide_severity_none,
  m.label_parental_guide_severity_mild,
  m.label_parental_guide_severity_moderate,
  m.label_parental_guide_severity_severe,
];

const formatSeverity = (value: number): string =>
  severities.at(value)?.() ?? '';

const categories = [
  {
    key: FilterKey.ParentalNudity,
    label: m.label_parental_guide_category_nudity,
  },
  {
    key: FilterKey.ParentalViolence,
    label: m.label_parental_guide_category_violence,
  },
  {
    key: FilterKey.ParentalProfanity,
    label: m.label_parental_guide_category_profanity,
  },
  {
    key: FilterKey.ParentalAlcohol,
    label: m.label_parental_guide_category_alcohol,
  },
  {
    key: FilterKey.ParentalFrightening,
    label: m.label_parental_guide_category_frightening,
  },
];

export const parentalGuideFilters: ReadonlyArray<RatingsFilter> = categories
  .map(
    ({ key, label }) => {
      const slider: SliderOption = {
        type: 'slider',
        range: { min: 0, max: severities.length - 1 },
        ticks: { count: severities.length, formatter: formatSeverity },
        formatLabel: ({ min, max }) =>
          m.advanced_filter_label_parental_guide({
            category: label(),
            min: formatSeverity(min),
            max: formatSeverity(max),
          }),
      };

      return { key, advancedOnly: true, ...slider, advanced: slider };
    },
  );
