import { crewPositionSchema } from '@trakt/api';
import { z } from 'zod';

export type CrewPosition = z.infer<typeof crewPositionSchema>;
