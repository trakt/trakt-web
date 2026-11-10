import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import {
  type AwardCeremony,
  AwardCeremonySchema,
} from '$lib/requests/models/AwardCeremony.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { AwardCatalogResponse } from '@trakt/api';

const awardCatalogRequest = ({ fetch }: ApiParams) =>
  api({ fetch }).awards.catalog();

const mapToAwardCeremony = (ceremony: AwardCatalogResponse): AwardCeremony => ({
  slug: ceremony.slug,
  name: ceremony.name,
  mediaTypes: ceremony.media_types,
  awards: ceremony.awards.map(({ slug, name }) => ({ slug, name })),
});

export const awardCatalogQuery = defineQuery({
  key: 'awardCatalog',
  invalidations: [],
  dependencies: [],
  request: awardCatalogRequest,
  mapper: (response) => response.body.map(mapToAwardCeremony),
  schema: AwardCeremonySchema.array(),
  ttl: time.hours(24),
});
