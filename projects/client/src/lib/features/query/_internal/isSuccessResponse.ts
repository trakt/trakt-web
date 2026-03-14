import type {
  RequestResponse,
  SuccessResponse,
} from '../models/ResponseDefinitions.ts';
import { isStatusResponse } from './isStatusResponse.ts';

export function isSuccessResponse<TInput>(
  response: RequestResponse<TInput>,
): response is SuccessResponse<TInput> {
  return isStatusResponse(response, 200) || isStatusResponse(response, 201);
}
