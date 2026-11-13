import type { DocumentaryCheck } from '../models/DocumentaryCheck.ts';
import type { DocumentaryCheckResponse } from '../models/DocumentaryCheckResponse.ts';

export function mapToDocumentaryCheck(
  response?: DocumentaryCheckResponse,
): DocumentaryCheck | Nil {
  if (!response?.applicable) {
    return null;
  }

  return {
    kind: 'documentary',
    tier: response.tier,
    summary: response.summary,
    makers: response.makers,
    disputes: response.disputes ?? [],
  };
}
