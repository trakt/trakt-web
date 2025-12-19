import type {
  RequestResponse,
  SuccessResponse,
} from '../models/ResponseDefinitions.ts';

export function isStatusResponse<TInput>(
  response: RequestResponse<TInput>,
  code: number,
): response is SuccessResponse<TInput> {
  return Array.isArray(response)
    ? response.every((item) => item?.status === code)
    : response?.status === code;
}
