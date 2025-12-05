import type { ApiParams } from '../../../requests/api.ts';
import type { Dependency } from '../models/Dependency.ts';
import { dependencyId } from './dependencyId.ts';
import { queryId } from './queryId.ts';

export function buildQueryKeys<TRequestParams extends ApiParams>(
  keyParam: string | ((params: TRequestParams) => string),
  requestParams: TRequestParams,
  hash: string,
  dependenciesParam: Dependency[] | ((params: TRequestParams) => Dependency[]),
  invalidations: readonly unknown[],
) {
  const key = queryId(
    typeof keyParam === 'function' ? keyParam(requestParams) : keyParam,
  );

  const resolved = Array.isArray(dependenciesParam)
    ? dependenciesParam
    : dependenciesParam(requestParams);

  const dependencies = resolved
    .filter((dependency) => dependency != null)
    .map((dependency) => dependencyId(dependency));

  return [key, hash, ...dependencies, ...invalidations] as const;
}
