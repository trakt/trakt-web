import { z } from 'zod';

export const VipFlowSchema = z.enum(['new', 'renew']);

export type VipFlow = z.infer<typeof VipFlowSchema>;
