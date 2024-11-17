import { deserialize } from '$app/forms';

export function formRequest<
  TResponse extends Record<string, unknown>,
>(
  url: string,
  payload: Record<string, number | string | boolean> = {},
) {
  const body = new FormData();
  Object.entries(payload)
    .forEach(([key, value]) => {
      body.append(key, value.toString());
    });

  return fetch(url, {
    method: 'POST',
    headers: {
      'x-sveltekit-action': 'true',
    },
    body: body,
  }).then(async (res) => {
    const text = await res.text();
    const deserialized = deserialize<TResponse, undefined>(text);

    if (deserialized?.type !== 'success') {
      throw new Error('Deserialization error. The data has betrayed us.');
    }

    return deserialized.data!;
  });
}
