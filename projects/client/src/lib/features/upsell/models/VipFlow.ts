import { z } from 'zod';

export const VipFlowSchema = z.enum(['new', 'renew', 'switch']);

export type VipFlow = z.infer<typeof VipFlowSchema>;
