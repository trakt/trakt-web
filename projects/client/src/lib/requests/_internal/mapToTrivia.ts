import type { MediaTrivia } from '../models/MediaTrivia.ts';
import type { TriviaResponse } from '../models/TriviaResponse.ts';

type TriviaItemsResponse = TriviaResponse['items'][0];

export function mapToTrivia(
  keyPrefix: string,
  response: TriviaItemsResponse,
): MediaTrivia {
  const key = `${keyPrefix}_${response.fact_id}_${response.order}`;

  return {
    key,
    text: response.text,
    isSpoiler: response.spoiler,
  };
}
