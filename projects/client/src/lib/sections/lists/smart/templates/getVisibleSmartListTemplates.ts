import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import type { SmartListTemplate } from '$lib/requests/models/SmartListTemplate.ts';
import type { SmartList } from '$lib/requests/queries/users/smartListQuery.ts';
import { isSameSmartListFilters } from '$lib/sections/smart-lists/isSameSmartListFilters.ts';
import { matchesDiscoverMode } from '../matchesDiscoverMode.ts';
import { closeOpenSmartListRanges } from './closeOpenSmartListRanges.ts';
import { getSmartListTemplateCopy } from './getSmartListTemplateCopy.ts';

const MAX_LISTS_WITH_TEMPLATES = 3;

type VisibleSmartListTemplatesProps = {
  templates: SmartListTemplate[];
  lists: SmartList[];
  mode: DiscoverMode;
};

const fitsMode = (template: SmartListTemplate, mode: DiscoverMode) =>
  template.mediaType === 'media' ||
  matchesDiscoverMode({ mediaType: template.mediaType, mode });

const isCovered = (template: SmartListTemplate, lists: SmartList[]) =>
  lists.some((list) =>
    list.source === template.source &&
    list.mediaType === template.mediaType &&
    isSameSmartListFilters(
      closeOpenSmartListRanges(list.filters),
      closeOpenSmartListRanges(template.filters),
    )
  );

export function getVisibleSmartListTemplates(
  { templates, lists, mode }: VisibleSmartListTemplatesProps,
): SmartListTemplate[] {
  if (lists.length >= MAX_LISTS_WITH_TEMPLATES) {
    return [];
  }

  return templates.filter((template) =>
    getSmartListTemplateCopy(template.id) !== undefined &&
    fitsMode(template, mode) &&
    !isCovered(template, lists)
  );
}
