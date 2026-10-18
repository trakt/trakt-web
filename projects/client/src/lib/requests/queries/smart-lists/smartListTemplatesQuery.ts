import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToSmartListPosters } from '$lib/requests/_internal/mapToSmartListPosters.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import type { SmartListMediaType } from '$lib/requests/models/SmartListMediaType.ts';
import type { SmartListSource } from '$lib/requests/models/SmartListSource.ts';
import {
  type SmartListTemplate,
  SmartListTemplateSchema,
} from '$lib/requests/models/SmartListTemplate.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { SmartListTemplateResponse } from '@trakt/api';

const smartListTemplatesRequest = ({ fetch }: ApiParams) =>
  api({ fetch }).smart_lists.templates({ query: { extended: 'images' } });

function mapToSmartListTemplate(
  template: SmartListTemplateResponse,
): SmartListTemplate {
  return {
    key: `smart-list-template-${template.id}`,
    id: template.id,
    source: template.source as SmartListSource,
    mediaType: template.media_type as SmartListMediaType,
    filters: template.filters,
    personal: template.personal,
    total: template.total ?? null,
    posters: mapToSmartListPosters(template.items),
  };
}

export const smartListTemplatesQuery = defineQuery({
  key: 'smartListTemplates',
  invalidations: [],
  dependencies: () => [],
  request: smartListTemplatesRequest,
  mapper: (response) => response.body.map(mapToSmartListTemplate),
  schema: SmartListTemplateSchema.array(),
  ttl: time.hours(1),
});
