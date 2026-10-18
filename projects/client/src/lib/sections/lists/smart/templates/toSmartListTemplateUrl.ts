import type { SmartListTemplate } from '$lib/requests/models/SmartListTemplate.ts';
import { toSmartListFilterParams } from '$lib/sections/smart-lists/toSmartListFilterParams.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { toDiscoverMode } from '../toDiscoverMode.ts';
import { closeOpenSmartListRanges } from './closeOpenSmartListRanges.ts';

type SmartListTemplateUrlProps = {
  template: Pick<SmartListTemplate, 'source' | 'mediaType' | 'filters'>;
  name: string;
};

export function toSmartListTemplateUrl({
  template,
  name,
}: SmartListTemplateUrlProps): string {
  return UrlBuilder.lists.smart.create({
    ...toSmartListFilterParams(closeOpenSmartListRanges(template.filters)),
    name,
    source: template.source,
    mode: toDiscoverMode(template.mediaType),
  });
}
