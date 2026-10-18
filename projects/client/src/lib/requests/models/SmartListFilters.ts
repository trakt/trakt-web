import { z } from 'zod';

const list = z.string().array().optional();
const range = z.number().array().optional();
const operator = z.enum(['and', 'or']).optional();

export const SmartListFiltersSchema = z.object({
  genres: list,
  genres_operator: operator,
  subgenres: list,
  certifications: list,
  languages: list,
  countries: list,
  statuses: list,
  networks: list,
  keywords: list,
  keywords_operator: operator,
  studios: list,
  people: list,
  people_operator: operator,
  people_role: z
    .enum(['any', 'cast', 'directing', 'writing', 'producing'])
    .optional(),
  watchnow: list,
  watchnow_country: z.string().optional(),
  years: range,
  released_within_days: z.number().optional(),
  ratings: range,
  runtimes: range,
  imdb_ratings: range,
  rt_meters: range,
  rt_user_meters: range,
  letterboxd_ratings: range,
  mal_ratings: range,
  tmdb_ratings: range,
  metascores: range,
  votes: range,
  imdb_votes: range,
  parental_nudity: range,
  parental_violence: range,
  parental_profanity: range,
  parental_alcohol: range,
  parental_frightening: range,
  parental_include_unrated: z.boolean().optional(),
  ignore_watched: z.boolean().optional(),
  ignore_watchlisted: z.boolean().optional(),
  ignore_watching: z.boolean().optional(),
  ignore_unreleased: z.boolean().optional(),
  ignore_released: z.boolean().optional(),
  ignore_ended: z.boolean().optional(),
  ignore_airing: z.boolean().optional(),
  ignore_no_release_date: z.boolean().optional(),
});

export type SmartListFilters = z.infer<typeof SmartListFiltersSchema>;
