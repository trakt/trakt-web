import type {
  NoContentResponse,
  RequestResponse,
} from '../models/ResponseDefinitions.ts';
import { isStatusResponse } from './isStatusResponse.ts';

export function isNoContentResponse<TInput>(
  response: RequestResponse<TInput>,
): response is NoContentResponse<TInput> {
  return isStatusResponse(response, 204);
}
