import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

// Bound the request so a hung endpoint cannot leave a search pending forever
// (the refresh sits in the search pipeline and gates the spinner).
const REQUEST_TIMEOUT = time.seconds(5);

const TypesenseConfigSchema = z.object({
  keys: z.object({
    media: z.object({
      default: z.string(),
      exact: z.string(),
    }),
    people: z.string(),
  }),
  server: z.string(),
});

export async function fetchSearchKeys(): Promise<TypesenseConfig> {
  const response = await fetch('/api/search-keys', {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch search keys: ${response.status}`);
  }
  return TypesenseConfigSchema.parse(await response.json());
}
