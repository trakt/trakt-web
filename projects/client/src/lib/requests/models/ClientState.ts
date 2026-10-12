import { z } from 'zod';

export const ClientStateSchema = z.record(z.string(), z.unknown());

export type ClientState = z.infer<typeof ClientStateSchema>;
