import z from 'zod';
import { isStripeUrl } from './isStripeUrl.ts';

export const StripeCheckoutResponseSchema = z.object({
  checkout_url: z.string().refine(isStripeUrl, {
    message: 'Checkout URL must be a valid Stripe URL',
  }),
});
