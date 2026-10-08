import { describe, expect, it } from 'vitest';
import {
  mapToYirPersonaResult,
  type YirPersonaResponse,
} from './mapToYirPersonaResult.ts';

const response: YirPersonaResponse = {
  persona: 'anime-voyager',
  runner_up: 'critic',
  confidence: 'strong',
  rarity: 6,
  card_number: 1234,
  traits: ['streak-keeper'],
  highlights: [{ kind: 'anime-episodes', value: 2453 }],
  runner_up_highlights: [{ kind: 'ratings', value: 80 }],
  scores: { 'anime-voyager': 90, critic: 70 } as YirPersonaResponse['scores'],
  streak: { longest: 205, started_at: '2026-03-02T00:00:00.000Z' },
  monthly: [{ month: 1, persona: 'anime-voyager' }],
};

describe('util: mapToYirPersonaResult', () => {
  it('should map snake_case fields to the camelCase model', () => {
    expect(mapToYirPersonaResult(response)).to.deep.equal({
      persona: 'anime-voyager',
      runnerUp: 'critic',
      confidence: 'strong',
      rarity: 6,
      cardNumber: 1234,
      traits: ['streak-keeper'],
      highlights: [{ kind: 'anime-episodes', value: 2453 }],
      runnerUpHighlights: [{ kind: 'ratings', value: 80 }],
      scores: { 'anime-voyager': 90, critic: 70 },
      streak: {
        longest: 205,
        startedAt: new Date('2026-03-02T00:00:00.000Z'),
      },
      monthly: [{ month: 1, persona: 'anime-voyager' }],
    });
  });

  it('should keep a null runner up for a non-hybrid persona', () => {
    expect(mapToYirPersonaResult({ ...response, runner_up: null }).runnerUp)
      .toBeNull();
  });

  it('should map a missing streak start to null', () => {
    const result = mapToYirPersonaResult({
      ...response,
      streak: { longest: 0, started_at: null },
    });

    expect(result.streak).to.deep.equal({ longest: 0, startedAt: null });
  });
});
