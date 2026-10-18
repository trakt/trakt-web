import type { SmartListFilters } from '$lib/requests/models/SmartListFilters.ts';
import type { SmartListSource } from '$lib/requests/models/SmartListSource.ts';
import { getSmartListFilterLabels } from '../getSmartListFilterLabels.ts';

type SmartListTemplateChipsProps = {
  source: SmartListSource;
  filters: SmartListFilters;
  showcase: keyof SmartListFilters;
};

const toFilterLabels = ({
  source,
  filters,
}: Pick<SmartListTemplateChipsProps, 'source' | 'filters'>) =>
  getSmartListFilterLabels({ source, filters }).slice(1);

export function toSmartListTemplateChips({
  source,
  filters,
  showcase,
}: SmartListTemplateChipsProps): string[] {
  const labels = toFilterLabels({ source, filters });
  const [showcaseLabel] = toFilterLabels({
    source,
    filters: { [showcase]: filters[showcase] },
  });

  const showcaseIndex = labels.findIndex((label) => label === showcaseLabel);
  if (showcaseLabel === undefined || showcaseIndex < 0) {
    return labels;
  }

  return [
    showcaseLabel,
    ...labels.filter((_, index) => index !== showcaseIndex),
  ];
}
