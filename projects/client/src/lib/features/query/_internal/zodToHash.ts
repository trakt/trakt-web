import { checksum } from '$lib/utils/string/checksum.ts';
import type { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

/*
  Keyed on the schema instance: keying on the serialized schema meant
  `zodToJsonSchema` + `JSON.stringify` - the expensive half - ran on every
  call and only `checksum` was ever skipped.
*/
const GLOBAL_CACHE = new WeakMap<z.ZodType, string>();

export function zodToHash(schema: z.ZodType): string {
  const cached = GLOBAL_CACHE.get(schema);

  if (cached != null) {
    return cached;
  }

  const hash = checksum(JSON.stringify(zodToJsonSchema(schema)));
  GLOBAL_CACHE.set(schema, hash);

  return hash;
}
