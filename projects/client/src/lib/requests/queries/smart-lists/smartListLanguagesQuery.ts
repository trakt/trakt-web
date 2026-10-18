import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { SmartListFilterOptionSchema } from '$lib/requests/models/SmartListFilterOption.ts';
import { time } from '$lib/utils/timing/time.ts';

type SmartListLanguagesParams = { type: DiscoverMode } & ApiParams;

const LANGUAGE_TYPES = {
  movie: ['movies'],
  show: ['shows'],
  media: ['movies', 'shows'],
} as const satisfies Record<DiscoverMode, ReadonlyArray<'movies' | 'shows'>>;

const smartListLanguagesRequest = ({ fetch, type }: SmartListLanguagesParams) =>
  Promise.all(
    LANGUAGE_TYPES[type].map((languageType) =>
      api({ fetch }).languages.list({ params: { type: languageType } }),
    ),
  );

export const smartListLanguagesQuery = defineQuery({
  key: 'smartListLanguages',
  invalidations: [],
  dependencies: (params: SmartListLanguagesParams) => [params.type],
  request: smartListLanguagesRequest,
  mapper: (responses) =>
    [
      ...new Map(
        responses
          .flatMap((response) => response.body)
          .map(({ code, name }) => [code, { value: code, label: name }]),
      ).values(),
    ].toSorted((a, b) => a.label.localeCompare(b.label)),
  schema: SmartListFilterOptionSchema.array(),
  ttl: time.hours(24),
});
