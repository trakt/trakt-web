import type { ApiParams } from '$lib/requests/api.ts';
import type { RequestResponse } from './ResponseDefinitions.ts';

export type RequestDefinition<TInput, TRequestParams extends ApiParams> = (
  { fetch }: TRequestParams,
) => Promise<RequestResponse<TInput>>;
