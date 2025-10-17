import type { ApiParams } from '$lib/requests/api.ts';
import type { InvalidateActionOptions } from '$lib/requests/models/InvalidateAction.ts';
import { type ZodType } from 'zod';
import type { Dependency } from './Dependency.ts';
import type { MapperDefinition } from './MapperDefinition.ts';
import type { RequestDefinition } from './RequestDefinition.ts';

export type DefineQueryProps<
  TInput,
  TOutput extends ZodType,
  TRequestParams extends ApiParams,
> = {
  key: string | ((params: TRequestParams) => string);
  invalidations: InvalidateActionOptions[];
  dependencies: Dependency[] | ((params: TRequestParams) => Dependency[]);
  request: RequestDefinition<TInput, TRequestParams>;
  mapper: MapperDefinition<TInput, TOutput, TRequestParams>;
  schema: TOutput;
  ttl: number | Nil;
  refetchOnWindowFocus?: boolean;
  retry?: number;
  enabled?: (params: TRequestParams) => boolean;
};
