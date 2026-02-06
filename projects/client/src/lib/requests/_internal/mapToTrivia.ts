import type { MediaTrivia } from '../models/MediaTrivia.ts';
import type { TriviaResponse } from '../models/TriviaResponse.ts';

export function mapToTrivia(
  keyPrefix: string,
  response: TriviaResponse['items'][0],
): MediaTrivia {
  const key = `${keyPrefix}_${response.fact_id}_${response.order}`;

  return {
    key,
    text: response.text,
    isSpoiler: response.spoiler,
  };
}
