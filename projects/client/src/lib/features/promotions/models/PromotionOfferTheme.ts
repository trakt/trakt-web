import { z } from 'zod';

export const PromotionOfferThemeSchema = z.enum(['tickets']);

export type PromotionOfferTheme = z.infer<typeof PromotionOfferThemeSchema>;
