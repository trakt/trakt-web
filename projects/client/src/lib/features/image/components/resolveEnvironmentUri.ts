import type { SerializedImageResponse } from '$lib/features/image/models/SerializedImageResponse.ts';
import { formRequest } from '$lib/requests/form/formRequest.ts';
import { IS_PROD } from '$lib/utils/env/index.ts';
const emptyResponse = {
  uri: '',
};

function createProductionUri(uri: string) {
  return Promise.resolve({
    uri,
  });
}

function createDevelopmentUri(uri: string) {
  return formRequest<SerializedImageResponse>(
    '/image/?/resolve',
    {
      url: uri,
    },
  ).catch(() => emptyResponse);
}

export function resolveEnvironmentUri(uri: string) {
  if (IS_PROD) {
    return createProductionUri(uri);
  }

  return createDevelopmentUri(uri);
}
