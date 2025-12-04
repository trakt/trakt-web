export function createMarkerFetch<T extends typeof fetch>(
  marker: string,
  baseFetch?: T,
): T {
  const fetchImpl = baseFetch || globalThis.fetch;

  return (function markerFetch(
    input: Parameters<T>[0],
    init?: Parameters<T>[1],
  ): Promise<Response> {
    if (!(typeof input === 'string')) {
      return fetchImpl(input, init);
    }

    const method = init?.method?.toUpperCase();

    if (method === 'GET') {
      const [path, queryString] = input.split('?');
      const params = new URLSearchParams(queryString || '');
      params.set('marker', marker);
      input = `${path}?${params.toString()}`;
    }

    return fetchImpl(input, init);
  }) as unknown as T;
}
