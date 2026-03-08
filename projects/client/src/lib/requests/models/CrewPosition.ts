import { z } from 'zod';

/*
  FIXME: for now duplicated from @trakt/api; the asString casts in
  @trakt/api causes the imported types to always be a string
*/

export const crewPositionSchema = z.enum([
  'acting',
  'production',
  'art',
  'crew',
  'costume & make-up',
  'directing',
  'writing',
  'sound',
  'camera',
  'lighting',
  'visual effects',
  'editing',
  'creator',
  'created by',
  'self',
  'narrator',
  'unknown',
]);

export type CrewPosition = z.infer<typeof crewPositionSchema>;
export type CrewPositions = {
  movies?: CrewPosition;
  shows?: CrewPosition;
};
