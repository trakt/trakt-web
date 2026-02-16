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
    analysis: response?.analysis ?? '',
    highlight: response?.highlight ?? '',
    aspect: {
      pros: response.aspect.pros.map((item) => appendDot(item.theme)),
      cons: response.aspect.cons.map((item) => appendDot(item.theme)),
    },
  };
}
