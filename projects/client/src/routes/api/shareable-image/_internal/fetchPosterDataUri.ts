import { Buffer } from 'node:buffer';

type FetchFn = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export async function fetchPosterDataUri(
  { posterUrl, fetch }: { posterUrl: string; fetch: FetchFn },
): Promise<string> {
  const response = await fetch(posterUrl, {
    headers: { 'Accept': 'image/jpeg, image/png' },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch poster: ${response.statusText}`);
  }

  const ext = posterUrl.split('.').pop()?.toLowerCase();
  const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');

  return `data:${mimeType};base64,${base64}`;
}
