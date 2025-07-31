import z from 'zod';

export const CreditCookieSchema = z.enum(['during', 'after']);

export type CreditCookie = z.infer<typeof CreditCookieSchema>;
