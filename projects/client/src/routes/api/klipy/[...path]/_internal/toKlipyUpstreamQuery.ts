// Everything the picker is allowed to ask for. `customer_id` is the opaque
// per-device id Klipy personalises on.
const FORWARDED_PARAMS = [
  'q',
  'page',
  'per_page',
  'customer_id',
  'locale',
  'content_filter',
];

const MAX_PER_PAGE = 50;

function toPerPage(value: string): string {
  const parsed = Number(value);

  // Clamped at both ends; upstream only answers a zero or negative size with
  // an error.
  if (!Number.isFinite(parsed) || parsed < 1) {
    return `${MAX_PER_PAGE}`;
  }

  return `${Math.min(parsed, MAX_PER_PAGE)}`;
}

/**
 * The query string sent upstream: the picker's parameters and nothing else, so
 * a caller cannot smuggle extra ones onto a request signed with our key.
 */
export function toKlipyUpstreamQuery(url: URL): URLSearchParams {
  return FORWARDED_PARAMS.reduce((params, name) => {
    const value = url.searchParams.get(name);

    if (value == null) {
      return params;
    }

    params.set(name, name === 'per_page' ? toPerPage(value) : value);
    return params;
  }, new URLSearchParams());
}
