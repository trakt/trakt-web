import type { YirPersonaId } from '../models/YirPersonaId.ts';
import type {
  YirHighlight,
  YirPersonaResult,
} from '../models/YirPersonaResult.ts';

export type YirPersonaResponse = {
  persona: YirPersonaId;
  runner_up: YirPersonaId | null;
  confidence: YirPersonaResult['confidence'];
  rarity: number;
  card_number: number;
  traits: YirPersonaResult['traits'];
  highlights: YirHighlight[];
  runner_up_highlights: YirHighlight[];
  scores: YirPersonaResult['scores'];
  streak: {
    longest: number;
    started_at: string | null;
  };
  monthly: YirPersonaResult['monthly'];
};

export function mapToYirPersonaResult(
  response: YirPersonaResponse,
): YirPersonaResult {
  return {
    persona: response.persona,
    runnerUp: response.runner_up,
    confidence: response.confidence,
    rarity: response.rarity,
    cardNumber: response.card_number,
    traits: response.traits,
    highlights: response.highlights,
    runnerUpHighlights: response.runner_up_highlights,
    scores: response.scores,
    streak: {
      longest: response.streak.longest,
      startedAt: response.streak.started_at
        ? new Date(response.streak.started_at)
        : null,
    },
    monthly: response.monthly,
  };
}
