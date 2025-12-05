import type { ApiParams } from '$lib/requests/api.ts';
import { getMarker } from '$lib/utils/date/Marker.ts';
import { monitor } from '$lib/utils/perf/monitor.ts';
import type {
  CreateInfiniteQueryOptions,
  CreateQueryOptions,
  InfiniteData,
  QueryKey,
} from '@tanstack/svelte-query';
import { type z, type ZodType } from 'zod';
import type { Paginatable } from '../../requests/models/Paginatable.ts';
import { checksum } from '../../utils/string/checksum.ts';
import { buildCommonOptions } from './_internal/buildCommonOptions.ts';
import { buildQueryKeys } from './_internal/buildQueryKeys.ts';
import { createMarkerFetch } from './_internal/createMarkerFetch.ts';
import { isValidResponse } from './_internal/isValidResponse.ts';
import { schemaId } from './_internal/schemaId.ts';
import { zodToHash } from './_internal/zodToHash.ts';
import type { DefineQueryProps } from './models/DefineQueryProps.ts';

export function defineQuery<
  TInput,
  TOutput extends ZodType,
  TError extends Error,
  TRequestParams extends ApiParams,
>(
  {
    request,
    mapper,
    schema,
    invalidations,
    ...params
  }: DefineQueryProps<TInput, TOutput, TRequestParams>,
) {
  const hash = schemaId(monitor(zodToHash, `${params.key} hashing`)(schema));

  return (
    requestParams: TRequestParams = {} as TRequestParams,
  ): CreateQueryOptions<z.infer<TOutput>, TError> => {
    const queryKey = buildQueryKeys({
      key: params.key,
      dependencies: params.dependencies,
      requestParams,
      hash,
      invalidations,
    });

    return {
      queryKey,
      queryFn: () => {
        // Get markers in queryFn to ensure they are up-to-date
        const marker = checksum(invalidations.map(getMarker).join(':'));

        return request({
          ...requestParams,
          fetch: createMarkerFetch(marker, requestParams.fetch),
        })
          .then((response) => {
            const isValid = isValidResponse(response, queryKey.at(0));
            return !isValid ? null : mapper(response, requestParams);
          });
      },
      ...buildCommonOptions(params, requestParams),
    };
  };
}

type PaginatedRequestParams = ApiParams & { page?: number };

// FIXME: see if we can unify defineQuery and defineInfiniteQuery more
export function defineInfiniteQuery<
  TInput,
  TEntry,
  TOutput extends ZodType<Paginatable<TEntry>>,
  TError extends Error,
  TRequestParams extends PaginatedRequestParams,
>({
  request,
  mapper,
  schema,
  invalidations,
  ...params
}: DefineQueryProps<TInput, TOutput, TRequestParams>) {
  const hash = schemaId(monitor(zodToHash, `${params.key} hashing`)(schema));

  return (
    requestParams: TRequestParams = {} as TRequestParams,
  ): CreateInfiniteQueryOptions<
    z.infer<TOutput>,
    TError,
    InfiniteData<z.infer<TOutput>>,
    QueryKey,
    number
  > => {
    const queryKey = buildQueryKeys({
      key: params.key,
      dependencies: params.dependencies,
      requestParams,
      hash,
      invalidations,
    });

    return {
      queryKey,
      queryFn: ({ pageParam }: { pageParam: number }) => {
        // Get markers in queryFn to ensure they are up-to-date
        const marker = checksum(invalidations.map(getMarker).join(':'));

        return request({
          ...requestParams,
          page: pageParam,
          fetch: createMarkerFetch(marker, requestParams.fetch),
        })
          .then((response) => {
            const isValid = isValidResponse(response, queryKey.at(0));

            if (!isValid) {
              return { entries: [], page: { current: 1, total: 1 } } as z.infer<
                TOutput
              >;
            }

            return mapper(response, requestParams);
          });
      },
      initialPageParam: requestParams.page ?? 1,
      getNextPageParam: (lastPage) => {
        const { page } = lastPage as Paginatable<TEntry>;
        const hasMore = page.current < page.total;
        return hasMore ? page.current + 1 : undefined;
      },
      ...buildCommonOptions(params, requestParams),
    };
  };
}
