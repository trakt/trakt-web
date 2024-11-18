import { ImageEndpoint } from '$lib/features/image/ImageEndpoint.ts';
import type { SerializedImageResponse } from '$lib/features/image/models/SerializedImageResponse.ts';
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
  return fetch(
    ImageEndpoint.Gimme,
    {
      method: 'POST',
      body: JSON.stringify({ url: uri }),
    },
  )
    .then((response) => response.json() as Promise<SerializedImageResponse>)
    .catch(() => emptyResponse);
}

export function resolveEnvironmentUri(uri: string) {
  if (IS_PROD) {
    return createProductionUri(uri);
  }

  return createDevelopmentUri(uri);
}
