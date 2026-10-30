import z from 'zod';

export const VipVeteranTitleSchema = z.enum(['veteran', 'legend']);

export type VipVeteranTitle = z.infer<typeof VipVeteranTitleSchema>;
