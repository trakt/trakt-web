import type {
  RequestResponse,
  SuccessResponse,
} from '../models/ResponseDefinitions.ts';

export function isSuccessResponse<TInput>(
  response: RequestResponse<TInput>,
): response is SuccessResponse<TInput> {
  return Array.isArray(response)
    ? response.every((item) => item?.status === 200)
    : response.status === 200;
}
