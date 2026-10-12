import { z } from 'zod';
import type { ClientRecord } from '../models/ClientRecord.ts';

export function parseRecordEntries<E>(
  entry: z.ZodType<E>,
): z.ZodType<ClientRecord<E>> {
  return z.record(z.string(), z.unknown()).transform((record) =>
    Object.fromEntries(
      Object.entries(record).flatMap(([id, value]) => {
        const parsed = entry.safeParse(value);
        return parsed.success ? [[id, parsed.data]] : [];
      }),
    ),
  ) as unknown as z.ZodType<ClientRecord<E>>;
}
