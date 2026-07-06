import { defineQuery } from '$lib/features/query/defineQuery.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { fetchReviewResource } from '../../_internal/fetchReviewResource.ts';
import { mapToYirPeople } from '../../_internal/mapToYirPerson.ts';
import { type YirPeopleType, YirPersonSchema } from '../../models/YirPerson.ts';
import type { YirYear } from '../../models/YirYear.ts';

export type YirPeopleParams = {
  slug: string;
  year: YirYear;
  type: YirPeopleType;
  slurm?: string;
} & ApiParams;

const yirPeopleRequest = async (
  { fetch, slug, year, type, slurm }: YirPeopleParams,
) => {
  const response = await fetchReviewResource({
    fetch,
    path: `/users/${slug}/yir/${year}/people/${type}`,
    slurm,
  });

  return response.ok
    ? { body: await response.json(), status: 200 }
    : { body: [], status: response.status };
};

export const yirPeopleQuery = defineQuery({
  key: 'yirPeople',
  invalidations: [],
  dependencies: (
    params,
  ) => [params.slug, params.year, params.type, params.slurm],
  request: yirPeopleRequest,
  mapper: (response) => mapToYirPeople(response.body),
  schema: YirPersonSchema.array(),
  ttl: time.hours(3),
});
