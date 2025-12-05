import { FETCH_ERROR_EVENT } from '$lib/features/errors/constants.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import { error as printError } from '$lib/utils/console/print.ts';
import { monitor } from '$lib/utils/perf/monitor.ts';
import type { CreateQueryOptions } from '@tanstack/svelte-query';
import { type z, type ZodType } from 'zod';
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
    const queryKeys = buildQueryKeys(
      params.key,
      requestParams,
      hash,
      params.dependencies,
      invalidations,
    );

    return {
      queryKey: queryKeys,
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
      staleTime: params.ttl == null ? undefined : params.ttl,
      refetchOnWindowFocus: params.refetchOnWindowFocus,
      retry: params.retry,
      enabled: params.enabled?.(requestParams) ?? true,
    };
  };
}
