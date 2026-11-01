import { z } from 'zod';
import { YirPersonaResultSchema } from './YirPersonaResult.ts';

export const YirPersonaAnswerSchema = z.object({
  isYearOpen: z.boolean(),
  result: YirPersonaResultSchema.nullable(),
});

export type YirPersonaAnswer = z.infer<typeof YirPersonaAnswerSchema>;
