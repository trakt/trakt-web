import z from 'zod';

export const VipTierTitleSchema = z.enum(['pro', 'veteran', 'elite', 'legend']);

export type VipTierTitle = z.infer<typeof VipTierTitleSchema>;
