import { FETCH_ERROR_EVENT } from '$lib/features/errors/constants.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import { error as printError } from '$lib/utils/console/print.ts';
import { monitor } from '$lib/utils/perf/monitor.ts';
import type {
  CreateInfiniteQueryOptions,
  CreateQueryOptions,
  InfiniteData,
  QueryKey,
} from '@tanstack/svelte-query';
import { type z, type ZodType } from 'zod';
import type { Paginatable } from '../../requests/models/Paginatable.ts';
import type { CustomFetchError } from '../errors/models/CustomFetchError.ts';
import { buildQueryKeys } from './_internal/buildQueryKeys.ts';
import { isNoContentResponse } from './_internal/isNoContentResponse.ts';
import { isSuccessResponse } from './_internal/isSuccessResponse.ts';
import { schemaId } from './_internal/schemaId.ts';
import { zodToHash } from './_internal/zodToHash.ts';
import type { DefineQueryProps } from './models/DefineQueryProps.ts';
import type { RequestResponse } from './models/ResponseDefinitions.ts';

// FIXME: extend with error schemas
class FetchError<TInput> extends Error {
  constructor(public response: RequestResponse<TInput>, message: string) {
    super(message);

    printError(message);

    // FIXME: see if we can leverage window.onerror
    const responses = Array.isArray(response) ? response : [response];
    responses.forEach(({ status, body }) => {
      globalThis.window.dispatchEvent(
        new CustomEvent<CustomFetchError>(FETCH_ERROR_EVENT, {
          detail: {
            status,
            message: status === 503 && typeof body === 'object'
              ? body.message
              : undefined,
          },
        }),
      );
    });
  }
}

function buildCommonOptions<TRequestParams extends ApiParams>(
  params: {
    ttl: number | Nil;
    refetchOnWindowFocus?: boolean;
    retry?: number;
    enabled?: (params: TRequestParams) => boolean;
  },
  requestParams: TRequestParams,
) {
  return {
    staleTime: params.ttl == null ? undefined : params.ttl,
    refetchOnWindowFocus: params.refetchOnWindowFocus,
    retry: params.retry,
    enabled: params.enabled?.(requestParams) ?? true,
  };
}

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
    const queryKey = buildQueryKeys(
      params.key,
      requestParams,
      hash,
      params.dependencies,
      invalidations,
    );

    return {
      queryKey,
      queryFn: () =>
        request(requestParams)
          .then((response) => {
            const isSuccess = isSuccessResponse(response);
            const isNoContent = isNoContentResponse(response);

            if (!(isSuccess || isNoContent)) {
              throw new FetchError(
                response,
                `Failed to fetch data: ${params.key}`,
              );
            }

            return isNoContent ? null : mapper(response, requestParams);
          }),
      ...buildCommonOptions(params, requestParams),
    };
  };
}

// TODO less duplication
export function defineInfiniteQuery<
  TInput,
  TEntry,
  TOutput extends ZodType<Paginatable<TEntry>>,
  TError extends Error,
  TRequestParams extends ApiParams,
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
    const queryKey = buildQueryKeys(
      params.key,
      requestParams,
      hash,
      params.dependencies,
      invalidations,
    );

    return {
      queryKey,
      queryFn: ({ pageParam }: { pageParam: number }) =>
        request({ ...requestParams, page: pageParam })
          .then((response) => {
            const isSuccess = isSuccessResponse(response);
            const isNoContent = isNoContentResponse(response);

            if (!(isSuccess || isNoContent)) {
              throw new FetchError(
                response,
                `Failed to fetch data: ${params.key}`,
              );
            }

            if (isNoContent) {
              return { entries: [], page: { current: 1, total: 1 } } as z.infer<
                TOutput
              >;
            }

            return mapper(response, requestParams);
          }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { page } = lastPage as Paginatable<TEntry>;
        const hasMore = page.current < page.total;
        return hasMore ? page.current + 1 : undefined;
      },
      ...buildCommonOptions(params, requestParams),
    };
  };
}
