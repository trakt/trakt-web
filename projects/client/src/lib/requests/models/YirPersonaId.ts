import { z } from 'zod';

export const YirPersonaIdSchema = z.enum([
  'anime-voyager',
  'day-one-devotee',
  'weekend-marathoner',
  'comfort-rewatcher',
  'omnivore',
  'opening-night',
  'cinephile',
  'critic',
  'loyalist',
  'curator',
  'wildcard',
  'opening-act',
]);

export type YirPersonaId = z.infer<typeof YirPersonaIdSchema>;
