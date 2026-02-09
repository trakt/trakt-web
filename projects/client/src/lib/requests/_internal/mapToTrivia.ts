import type { MediaTrivia } from '../models/MediaTrivia.ts';
import type { TriviaResponse } from '../models/TriviaResponse.ts';

type TriviaItemsResponse = TriviaResponse['items'][0];
type TriviaSummaryResponse = TriviaResponse['summary'];

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

export function mapToTriviaSummary(
  keyPrefix: string,
  response: TriviaSummaryResponse,
): MediaTrivia {
  const key = `${keyPrefix}_summary`;

  return {
    key,
    text: response.map((item) => `- ${item}`).join('\n'),
  };
}
