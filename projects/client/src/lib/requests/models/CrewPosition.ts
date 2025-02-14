import { crewPositionSchema } from '$lib/api.ts';
import { z } from 'zod';

export type CrewPosition = z.infer<typeof crewPositionSchema>;
