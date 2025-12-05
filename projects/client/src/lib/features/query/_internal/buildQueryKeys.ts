import type { ZodType } from 'zod';
import type { ApiParams } from '../../../requests/api.ts';
import type { DefineQueryProps } from '../models/DefineQueryProps.ts';
import { dependencyId } from './dependencyId.ts';
import { queryId } from './queryId.ts';

type BuildQueryKeyParams<
  TInput,
  TOutput extends ZodType,
  TRequestParams extends ApiParams,
> =
  & {
    requestParams: TRequestParams;
    hash: string;
  }
  & Pick<
    DefineQueryProps<TInput, TOutput, TRequestParams>,
    'key' | 'dependencies' | 'invalidations'
  >;

export function buildQueryKeys<
  TInput,
  TOutput extends ZodType,
  TRequestParams extends ApiParams,
>(
  {
    hash,
    requestParams,
    key,
    dependencies,
    invalidations,
  }: BuildQueryKeyParams<TInput, TOutput, TRequestParams>,
) {
  const queryKey = queryId(
    typeof key === 'function' ? key(requestParams) : key,
  );

  const resolved = Array.isArray(dependencies)
    ? dependencies
    : dependencies(requestParams);

  const filteredDependencies = resolved
    .filter((dependency) => dependency != null)
    .map((dependency) => dependencyId(dependency));

  return [
    queryKey,
    hash,
    ...filteredDependencies,
    ...invalidations,
  ] as const;
}
