import type { ApiParams } from '$lib/requests/api.ts';
import { type z, type ZodType } from 'zod';
import type { SuccessResponse } from './ResponseDefinitions.ts';

export type MapperDefinition<
  TInput,
  TOutput extends ZodType,
  TRequestParams extends ApiParams,
> = (
  response: SuccessResponse<TInput>,
  params: TRequestParams,
) => z.infer<TOutput>;
