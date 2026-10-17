import { z } from 'zod';

export const MixtapeVectorsSchema = z.object({
  cutoff: z.number(),
  vectors: z.record(z.string(), z.string()),
});

export type MixtapeVectors = z.infer<typeof MixtapeVectorsSchema>;
