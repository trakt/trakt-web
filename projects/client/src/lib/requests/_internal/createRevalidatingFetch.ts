export function createRevalidatingFetch<T extends typeof fetch>(
  baseFetch: T,
): T {
  return (function revalidatingFetch(
    input: Parameters<T>[0],
    init?: Parameters<T>[1],
  ): Promise<Response> {
    return baseFetch(input, { ...init, cache: 'reload' });
  }) as T;
}
