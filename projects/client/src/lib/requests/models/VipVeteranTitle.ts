import z from 'zod';

export const VipVeteranTitleSchema = z.enum([
  'pro',
  'veteran',
  'elite',
  'legend',
]);

export type VipVeteranTitle = z.infer<typeof VipVeteranTitleSchema>;
