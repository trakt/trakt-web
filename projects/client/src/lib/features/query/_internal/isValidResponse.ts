import { FETCH_ERROR_EVENT } from '$lib/features/errors/constants.ts';
import { error as printError } from '$lib/utils/console/print.ts';
import type { CustomFetchError } from '../../errors/models/CustomFetchError.ts';
import type {
  InputWithStatus,
  RequestResponse,
} from '../models/ResponseDefinitions.ts';
import { isNoContentResponse } from './isNoContentResponse.ts';
import { isSuccessResponse } from './isSuccessResponse.ts';

// FIXME: extend with error schemas
class FetchError<TInput> extends Error {
  constructor(public response: RequestResponse<TInput>, message: string) {
    super(message);

    printError(message);

    // FIXME: see if we can leverage window.onerror
    const responses = Array.isArray(response) ? response : [response];
    responses.forEach(({ status, body }) => {
      globalThis.window.dispatchEvent(
        new CustomEvent<CustomFetchError>(FETCH_ERROR_EVENT, {
          detail: {
            status,
            message: status === 503 && typeof body === 'object'
              ? body.message
              : undefined,
          },
        }),
      );
    });
  }
}

export function isValidResponse<TInput>(
  response: InputWithStatus<TInput, number>,
  key?: string,
): response is InputWithStatus<TInput, 200> {
  const isSuccess = isSuccessResponse(response);
  const isNoContent = isNoContentResponse(response);

  if (!(isSuccess || isNoContent)) {
    throw new FetchError(
      response,
      `Failed to fetch data: ${key}`,
    );
  }

  return isSuccess;
}
