import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import {
  type SmartListFilterOption,
  SmartListFilterOptionSchema,
} from '$lib/requests/models/SmartListFilterOption.ts';
import type { SmartListFilterOptionKind } from '$lib/requests/models/SmartListFilterOptionKind.ts';
import { time } from '$lib/utils/timing/time.ts';
import { buildParamString } from '$lib/utils/url/buildParamString.ts';
import { z } from 'zod';
import { MIN_FILTER_OPTION_QUERY_LENGTH } from './minFilterOptionQueryLength.ts';

const LIMIT = 20;

const NamedOptionSchema = z.object({ name: z.string() });
const StudioOptionSchema = z.object({ slug: z.string(), name: z.string() });
const PersonResultSchema = z.object({
  person: z.object({ name: z.string(), ids: z.object({ slug: z.string() }) }),
});

type SmartListFilterOptionsParams = {
  kind: SmartListFilterOptionKind;
  query: string;
} & ApiParams;

const OPTION_SOURCES: Record<
  SmartListFilterOptionKind,
  { path: string; toOptions: (body: unknown) => SmartListFilterOption[] }
> = {
  keywords: {
    path: '/smart-lists/filter-options/keywords',
    toOptions: (body) =>
      NamedOptionSchema.array().parse(body).map(({ name }) => ({
        value: name,
        label: name,
      })),
  },
  networks: {
    path: '/smart-lists/filter-options/networks',
    toOptions: (body) =>
      NamedOptionSchema.array().parse(body).map(({ name }) => ({
        value: name,
        label: name,
      })),
  },
  studios: {
    path: '/smart-lists/filter-options/studios',
    toOptions: (body) =>
      StudioOptionSchema.array().parse(body).map(({ slug, name }) => ({
        value: slug,
        label: name,
      })),
  },
  people: {
    path: '/search/person',
    toOptions: (body) =>
      PersonResultSchema.array().parse(body).map(({ person }) => ({
        value: person.ids.slug,
        label: person.name,
      })),
  },
};

const smartListFilterOptionsRequest = async (
  { fetch, kind, query }: SmartListFilterOptionsParams,
) => {
  const source = OPTION_SOURCES[kind];
  const response = await rawApiFetch({
    fetch,
    path: `${source.path}${buildParamString({ query, limit: LIMIT })}`,
  });

  if (!response.ok) {
    throw new Error(`Smart list ${kind} options failed (${response.status})`);
  }

  return {
    body: source.toOptions(await response.json()),
    status: 200 as const,
  };
};

export const smartListFilterOptionsQuery = defineQuery({
  key: 'smartListFilterOptions',
  invalidations: [],
  dependencies: (params) => [params.kind, params.query],
  request: smartListFilterOptionsRequest,
  mapper: (response) => response.body,
  schema: SmartListFilterOptionSchema.array(),
  ttl: time.hours(12),
  enabled: (params) =>
    params.query.trim().length >= MIN_FILTER_OPTION_QUERY_LENGTH,
});
