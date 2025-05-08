import type {
  RequestResponse,
  SuccessResponse,
} from '../models/ResponseDefinitions.ts';

const SUCCESSFUL_STATUSES: number[] = [200, 204] as const;

export function isSuccessResponse<TInput>(
  response: RequestResponse<TInput>,
): response is SuccessResponse<TInput> {
  return Array.isArray(response)
    ? response.every((item) => SUCCESSFUL_STATUSES.includes(item?.status))
    : SUCCESSFUL_STATUSES.includes(response.status);
}
