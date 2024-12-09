import type { MovieSummary } from '$lib/requests/models/MovieSummary.ts';
import type { ShowSummary } from '$lib/requests/models/ShowSummary.ts';

export type MediaSummary = MovieSummary | ShowSummary;
