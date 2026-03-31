type FetchWithUserAgentProps<TFetch extends typeof globalThis.fetch> = {
  userAgent: string | null;
  fetch: TFetch;
};

export function fetchWithUserAgent<TFetch extends typeof globalThis.fetch>(
  { userAgent, fetch }: FetchWithUserAgentProps<TFetch>,
): TFetch {
  return ((input: Parameters<TFetch>[0], init?: Parameters<TFetch>[1]) => {
    const headers = new Headers(init?.headers);
    if (userAgent) {
      headers.set('User-Agent', userAgent);
    }

    return fetch(input, { ...init, headers } as Parameters<TFetch>[1]);
  }) as unknown as TFetch;
}
