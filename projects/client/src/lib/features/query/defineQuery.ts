import { FETCH_ERROR_EVENT } from '$lib/features/errors/constants.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import type { InvalidateActionOptions } from '$lib/requests/models/InvalidateAction.ts';
import { error as printError } from '$lib/utils/console/print.ts';
import { monitor } from '$lib/utils/perf/monitor.ts';
import type { CreateQueryOptions } from '@tanstack/svelte-query';
import { type z, type ZodType } from 'zod';
import { zodToHash } from './_internal/zodToHash.ts';

type InputWithStatus<TInput, TStatus> = TInput extends readonly [...infer U]
  ? { [K in keyof U]: U[K] & { status: TStatus } }
  : TInput & { status: TStatus };

type RequestResponse<TInput> = InputWithStatus<TInput, number>;
type SuccessResponse<TInput> = InputWithStatus<TInput, 200>;

type RequestDefinition<TInput, TRequestParams extends ApiParams> = (
  { fetch }: TRequestParams,
) => Promise<RequestResponse<TInput>>;

type MapperDefinition<
  TInput,
  TOutput extends ZodType,
  TRequestParams extends ApiParams,
> = (
  response: SuccessResponse<TInput>,
  params: TRequestParams,
) => z.infer<TOutput>;

type Dependency = number | string | Date | Nil;

type DefineQueryProps<
  TInput,
  TOutput extends ZodType,
  TRequestParams extends ApiParams,
> = {
  key: string;
  invalidations: InvalidateActionOptions[];
  dependencies: Dependency[] | ((params: TRequestParams) => Dependency[]);
  request: RequestDefinition<TInput, TRequestParams>;
  mapper: MapperDefinition<TInput, TOutput, TRequestParams>;
  schema: TOutput;
  ttl: number | Nil;
  refetchOnWindowFocus?: boolean;
  retry?: number;
};

// FIXME: extend with error schemas
class FetchError<TInput> extends Error {
  constructor(public response: RequestResponse<TInput>, message: string) {
    super(message);

    printError(message);

    // FIXME: see if we can leverage window.onerror
    const responses = Array.isArray(response) ? response : [response];
    responses.forEach(({ status }) => {
      globalThis.window.dispatchEvent(
        new CustomEvent(FETCH_ERROR_EVENT, { detail: status }),
      );
    });
  }
}

const QUERY_ID = 'query';
const SCHEMA_ID = 'schema';
const DEPENDENCY_ID = 'dependency';

function isSuccessResponse<TInput>(
  response: RequestResponse<TInput>,
): response is SuccessResponse<TInput> {
  return Array.isArray(response)
    ? response.every((item) => item?.status === 200)
    : response.status === 200;
}

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
  const key = queryId(params.key);
  const hash = schemaId(monitor(zodToHash, `${params.key} hashing`)(schema));

  return (
    requestParams: TRequestParams = {} as TRequestParams,
  ): CreateQueryOptions<z.infer<TOutput>, TError> => {
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
      queryFn: () =>
        request(requestParams)
          .then((response) => {
            if (!isSuccessResponse(response)) {
              throw new FetchError(response, `Failed to fetch data: ${key}`);
            }

            return mapper(response, requestParams);
          }),
      staleTime: params.ttl == null ? undefined : params.ttl,
      refetchOnWindowFocus: params.refetchOnWindowFocus,
      retry: params.retry,
    };
  };
}
