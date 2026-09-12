type GifShareParams = {
  slug: string;
  customerId: string;
  fetch?: typeof fetch;
};

/**
 * Tells Klipy a gif was actually used. Their ranking leans on it, and it is
 * fire-and-forget - a failed ping must never block posting a comment.
 */
export function gifShareRequest({
  slug,
  customerId,
  fetch = globalThis.fetch,
}: GifShareParams): Promise<void> {
  return fetch(`/api/klipy/gifs/share/${encodeURIComponent(slug)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ customer_id: customerId }),
  })
    .then(() => undefined)
    .catch(() => undefined);
}
