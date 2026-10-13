import { SEO_ORIGIN } from '$lib/features/seo/seoOrigin.ts';
import { toRelativeMarkdownLinks } from '$lib/utils/markdown/toRelativeMarkdownLinks.ts';
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
    text: toRelativeMarkdownLinks(response.text, SEO_ORIGIN),
    isSpoiler: response.spoiler,
    category: response.category,
  };
}
