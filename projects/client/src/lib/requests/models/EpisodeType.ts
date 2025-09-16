import { z } from 'zod';

const EpisodeFinaleTypeSchema = z.enum([
  'series_finale',
  'season_finale',
  'mid_season_finale',
]);
const EpisodePremiereTypeSchema = z.enum([
  'series_premiere',
  'season_premiere',
  'mid_season_premiere',
]);
const EpisodeUnknownTypeSchema = z.enum(['unknown']);
const EpisodeStandardTypeSchema = z.enum(['standard']);
const EpisodeComputedTypeSchema = z.enum(['full_season', 'multiple_episodes']);

export const EpisodeTypeSchema = z.union([
  EpisodeFinaleTypeSchema,
  EpisodePremiereTypeSchema,
  EpisodeUnknownTypeSchema,
  EpisodeStandardTypeSchema,
  EpisodeComputedTypeSchema,
]);
export type EpisodeType = z.infer<typeof EpisodeTypeSchema>;

export const EpisodeFinaleType = EpisodeFinaleTypeSchema.Enum;
export type EpisodeFinaleType = z.infer<typeof EpisodeFinaleTypeSchema>;

export const EpisodePremiereType = EpisodePremiereTypeSchema.Enum;
export type EpisodePremiereType = z.infer<typeof EpisodePremiereTypeSchema>;

export const EpisodeUnknownType = EpisodeUnknownTypeSchema.Enum;
export type EpisodeUnknownType = z.infer<typeof EpisodeUnknownTypeSchema>;

export const EpisodeStandardType = EpisodeStandardTypeSchema.Enum;
export type EpisodeStandardType = z.infer<typeof EpisodeStandardTypeSchema>;

export const EpisodeComputedType = EpisodeComputedTypeSchema.Enum;
export type EpisodeComputedType = z.infer<typeof EpisodeComputedTypeSchema>;
