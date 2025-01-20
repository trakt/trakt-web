import type { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export async function zodToHash(schema: z.ZodType): Promise<string> {
  const schemaString = JSON.stringify(zodToJsonSchema(schema));

  // Convert string to Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(schemaString);

  // Create hash using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);

  // Convert to hex string
  const hash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return hash;
}
