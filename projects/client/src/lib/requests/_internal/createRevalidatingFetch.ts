export function createRevalidatingFetch(
  baseFetch: typeof fetch = globalThis.fetch,
): typeof fetch {
  return (input, init) => baseFetch(input, { ...init, cache: 'reload' });
}
