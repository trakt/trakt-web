import type { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const GLOBAL_CACHE = new Map<string, string>();

function toHash(input: string): string {
  const data = Array.from(new TextEncoder().encode(input));
  return data.reduce((hash, byte) => {
    const newHash = ((hash << BigInt(5)) - hash) + BigInt(byte);
    return newHash & newHash;
  }, BigInt(0)).toString(32).slice(-32);
}

export function zodToHash(schema: z.ZodType): string {
  const schemaString = JSON.stringify(zodToJsonSchema(schema));

  const hash = GLOBAL_CACHE.get(schemaString) ?? toHash(schemaString);
  GLOBAL_CACHE.set(schemaString, hash);

  return hash;
}
