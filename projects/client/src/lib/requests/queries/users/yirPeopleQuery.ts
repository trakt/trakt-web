import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToYirPeople } from '../../_internal/mapToYirPerson.ts';
import { type YirPeopleType, YirPersonSchema } from '../../models/YirPerson.ts';

export type YirPeopleParams = {
  slug: string;
  year: number;
  type: YirPeopleType;
} & ApiParams;

const yirPeopleRequest = async (
  { fetch, slug, year, type }: YirPeopleParams,
) => {
  const response = await rawApiFetch({
    fetch,
    path: `/users/${slug}/yir/${year}/people/${type}?extended=images`,
  });

  return response.ok
    ? { body: await response.json(), status: 200 }
    : { body: [], status: response.status };
};

export const yirPeopleQuery = defineQuery({
  key: 'yirPeople',
  invalidations: [],
  dependencies: (params) => [params.slug, params.year, params.type],
  request: yirPeopleRequest,
  mapper: (response) => mapToYirPeople(response.body),
  schema: YirPersonSchema.array(),
  ttl: time.hours(3),
});
