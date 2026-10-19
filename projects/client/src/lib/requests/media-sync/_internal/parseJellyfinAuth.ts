import z from 'zod';
import type { JellyfinAuth } from '../models/JellyfinAuth.ts';

const JellyfinAuthResponseSchema = z.object({
  status: z.enum(['pending', 'authenticated']),
  attempt_id: z.string(),
  code: z.string().nullable(),
  expires_in: z.number().nullable(),
  server_name: z.string(),
  account_name: z.string().nullable(),
  libraries: z
    .array(
      z.object({
        external_id: z.string(),
        kind: z.enum(['movies', 'shows']),
        title: z.string(),
        item_count: z.number().nullable(),
      }),
    )
    .nullable(),
});

export function parseJellyfinAuth(body: unknown): JellyfinAuth {
  const response = JellyfinAuthResponseSchema.parse(body);

  if (response.status === 'pending') {
    return {
      status: 'pending',
      attemptId: response.attempt_id,
      code: response.code ?? '',
      expiresIn: response.expires_in,
      serverName: response.server_name,
    };
  }

  return {
    status: 'authenticated',
    attemptId: response.attempt_id,
    serverName: response.server_name,
    libraries: (response.libraries ?? []).map((library) => ({
      externalId: library.external_id,
      kind: library.kind,
      title: library.title,
      itemCount: library.item_count,
    })),
  };
}
