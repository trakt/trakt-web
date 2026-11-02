export function fetchWithoutAuthorization<
  TFetch extends typeof globalThis.fetch,
>(fetch: TFetch): TFetch {
  return ((input: Parameters<TFetch>[0], init?: Parameters<TFetch>[1]) => {
    const headers = new Headers(init?.headers);
    headers.delete('Authorization');

    return fetch(input, { ...init, headers });
  }) as unknown as TFetch;
}
