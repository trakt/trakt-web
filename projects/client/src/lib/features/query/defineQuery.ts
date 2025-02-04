import type { ApiParams } from '$lib/requests/api.ts';
import type { InvalidateActionOptions } from '$lib/requests/models/InvalidateAction.ts';
import { monitor } from '$lib/utils/perf/monitor.ts';
import type { CreateQueryOptions } from '@tanstack/svelte-query';
import type { z, ZodType } from 'zod';
import { zodToHash } from './_internal/zodToHash.ts';

type RequestDefinition<TInput, TRequestParams extends ApiParams> = (
  { fetch }: TRequestParams,
) => Promise<TInput>;
type MapperDefinition<
  TInput,
  TOutput extends ZodType,
  TRequestParams extends ApiParams,
> = (
  response: TInput,
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
          .then((data) => mapper(data, requestParams)),
      staleTime: params.ttl == null ? undefined : params.ttl,
      refetchOnWindowFocus: params.refetchOnWindowFocus,
      retry: params.retry,
    };
  };
}
