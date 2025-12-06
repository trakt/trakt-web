import { FETCH_ERROR_EVENT } from '$lib/features/errors/constants.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import { error as printError } from '$lib/utils/console/print.ts';
import { getMarker } from '$lib/utils/date/Marker.ts';
import { monitor } from '$lib/utils/perf/monitor.ts';
import { checksum } from '$lib/utils/string/checksum.ts';
import type { CreateQueryOptions } from '@tanstack/svelte-query';
import { type z, type ZodType } from 'zod';
import type { CustomFetchError } from '../errors/models/CustomFetchError.ts';
import { createMarkerFetch } from './_internal/createMarkerFetch.ts';
import { isNoContentResponse } from './_internal/isNoContentResponse.ts';
import { isSuccessResponse } from './_internal/isSuccessResponse.ts';
import { zodToHash } from './_internal/zodToHash.ts';
import type { DefineQueryProps } from './models/DefineQueryProps.ts';
import type { Dependency } from './models/Dependency.ts';
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

const QUERY_ID = 'query';
const SCHEMA_ID = 'schema';
const DEPENDENCY_ID = 'dependency';

export function queryId(key: string) {
  return `${QUERY_ID}:${key}`;
}

export function schemaId(key: string) {
  return `${SCHEMA_ID}:${key}`;
}

export function dependencyId(key: Dependency) {
  return `${DEPENDENCY_ID}:${key}`;
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
    const key = queryId(
      typeof params.key === 'function' ? params.key(requestParams) : params.key,
    );

    const resolved = Array.isArray(params.dependencies)
      ? params.dependencies
      : params.dependencies(requestParams);

    const dependencies = resolved
      .filter((dependency) => dependency != null)
      .map((dependency) => dependencyId(dependency));

    return {
      queryKey: [
        key,
        hash,
        ...dependencies,
        ...invalidations,
      ] as const,
      queryFn: () => {
        // Get markers in queryFn to ensure they are up-to-date
        const marker = checksum(invalidations.map(getMarker).join(':'));

        return request({
          ...requestParams,
          fetch: createMarkerFetch(marker, requestParams.fetch),
        })
          .then((response) => {
            const isSuccess = isSuccessResponse(response);
            const isNoContent = isNoContentResponse(response);

            if (!(isSuccess || isNoContent)) {
              throw new FetchError(response, `Failed to fetch data: ${key}`);
            }

            return isNoContent ? null : mapper(response, requestParams);
          });
      },
      staleTime: params.ttl == null ? undefined : params.ttl,
      refetchOnWindowFocus: params.refetchOnWindowFocus,
      retry: params.retry,
      enabled: params.enabled?.(requestParams) ?? true,
    };
  };
}
