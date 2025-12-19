import type { MediaTrivia } from '../models/MediaTrivia.ts';
import type { TriviaResponse } from '../models/TriviaResponse.ts';

export function mapToTrivia(
  key: string,
  response: TriviaResponse,
): MediaTrivia {
  return {
    key,
    text: response.text,
    isSpoiler: response.spoiler,
  };
}
