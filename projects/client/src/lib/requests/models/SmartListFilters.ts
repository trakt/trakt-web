import { z } from 'zod';

const list = z.string().array().optional();
const range = z.number().array().optional();

export const SmartListFiltersSchema = z.object({
  genres: list,
  subgenres: list,
  certifications: list,
  languages: list,
  countries: list,
  statuses: list,
  networks: list,
  watchnow: list,
  years: range,
  ratings: range,
  runtimes: range,
  imdb_ratings: range,
  rt_meters: range,
  rt_user_meters: range,
  parental_nudity: range,
  parental_violence: range,
  parental_profanity: range,
  parental_alcohol: range,
  parental_frightening: range,
  ignore_watched: z.boolean().optional(),
  ignore_watchlisted: z.boolean().optional(),
});

export type SmartListFilters = z.infer<typeof SmartListFiltersSchema>;
