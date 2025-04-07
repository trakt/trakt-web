import type { Sentiments } from '$lib/requests/models/Sentiments.ts';
import type { SentimentsResponse } from '@trakt/api';

export function mapToSentiments(response: SentimentsResponse): Sentiments {
  return {
    good: response.good.map((item) => item.sentiment),
    bad: response.bad.map((item) => item.sentiment),
  };
}
