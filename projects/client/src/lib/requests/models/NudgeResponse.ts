import { z } from 'zod';

export const NudgeResponseSchema = z.object({
  nudge: z
    .object({
      type: z.string(),
      limit: z.string().nullish(),
      used: z.number().nullish(),
      total: z.number().nullish(),
    })
    .nullish(),
});

export type NudgeResponse = z.infer<typeof NudgeResponseSchema>;
