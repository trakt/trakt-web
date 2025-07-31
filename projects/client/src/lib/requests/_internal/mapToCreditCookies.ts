import type { EpisodeResponse, MovieResponse } from '@trakt/api';
import type { CreditCookie } from '../models/CreditCookieSchema.ts';

export function mapToCreditCookies(
  response: EpisodeResponse | MovieResponse,
): CreditCookie[] {
  const cookies: CreditCookie[] = [];

  response.during_credits && cookies.push('during');
  response.after_credits && cookies.push('after');

  return cookies;
}
