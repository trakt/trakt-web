import { z } from 'zod';
import { VipPlanDurationSchema } from './VipPlanDuration.ts';

export const VipTypeSchema = z.enum([...VipPlanDurationSchema.options, 'life']);

export type VipType = z.infer<typeof VipTypeSchema>;
