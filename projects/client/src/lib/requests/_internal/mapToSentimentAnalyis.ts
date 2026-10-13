import { SEO_ORIGIN } from '$lib/features/seo/seoOrigin.ts';
import { toRelativeMarkdownLinks } from '$lib/utils/markdown/toRelativeMarkdownLinks.ts';
import type { SentimentAnalysis } from '../models/SentimentAnalysis.ts';
import type { SentimentResponse } from '../models/SentimentResponse.ts';

function appendDot(text: string): string {
  return text.endsWith('.') ? text : `${text}.`;
}

export function mapToSentimentAnalysis(
  response?: SentimentResponse,
): SentimentAnalysis | Nil {
  if (!response) {
    return null;
  }

  return {
    analysis: toRelativeMarkdownLinks(response.analysis ?? '', SEO_ORIGIN),
    highlight: toRelativeMarkdownLinks(response.highlight ?? '', SEO_ORIGIN),
    aspect: {
      pros: response.aspect.pros.map((item) => appendDot(item.theme)),
      cons: response.aspect.cons.map((item) => appendDot(item.theme)),
    },
  };
}
