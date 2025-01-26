import { checksum } from '$lib/utils/string/checksum';
import type { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const GLOBAL_CACHE = new Map<string, string>();

export function zodToHash(schema: z.ZodType): string {
  const schemaString = JSON.stringify(zodToJsonSchema(schema));

  const hash = GLOBAL_CACHE.get(schemaString) ?? checksum(schemaString);
  GLOBAL_CACHE.set(schemaString, hash);

  return hash;
}
