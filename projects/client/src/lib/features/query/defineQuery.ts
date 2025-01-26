import type { ApiParams } from '$lib/requests/api';
import type { InvalidateActionOptions } from '$lib/requests/models/InvalidateAction';
import { monitor } from '$lib/utils/perf/monitor';
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
  ttl?: number;
};

export const QUERY_ID = 'query';
export const SCHEMA_ID = 'schema';
export const DEPENDENCY_ID = 'dependency';

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
  const key = `${QUERY_ID}:${params.key}`;
  const hash = `${SCHEMA_ID}:${
    monitor(zodToHash, `${params.key} hashing`)(schema)
  }`;

  return (
    requestParams: TRequestParams = {} as TRequestParams,
  ): CreateQueryOptions<z.infer<TOutput>, TError> => {
    const resolved = Array.isArray(params.dependencies)
      ? params.dependencies
      : params.dependencies(requestParams);

    const dependencies = resolved
      .filter((dependency) => dependency != null)
      .map((dependency) => `${DEPENDENCY_ID}:${dependency}`);

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
      staleTime: params.ttl,
    };
  };
}
