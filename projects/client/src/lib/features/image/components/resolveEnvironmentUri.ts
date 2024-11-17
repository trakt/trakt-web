import { deserialize } from '$app/forms';
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
  const body = new FormData();
  body.append('url', uri);

  return fetch('/image/?/resolve', {
    method: 'POST',
    headers: {
      'x-sveltekit-action': 'true',
    },
    body: body,
  }).then(async (res) => {
    const text = await res.text();
    const deserialized = deserialize<SerializedImageResponse, undefined>(
      text,
    );

    if (deserialized?.type === 'success') {
      return deserialized.data ?? emptyResponse;
    }

    return emptyResponse;
  });
}

export function resolveEnvironmentUri(uri: string) {
  if (IS_PROD) {
    return createProductionUri(uri);
  }

  return createDevelopmentUri(uri);
}
