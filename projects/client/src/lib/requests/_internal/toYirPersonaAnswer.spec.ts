import { describe, expect, it } from 'vitest';
import type { YirPersonaResponse } from './mapToYirPersonaResult.ts';
import { toYirPersonaAnswer } from './toYirPersonaAnswer.ts';

const body: YirPersonaResponse = {
  persona: 'anime-voyager',
  runner_up: null,
  confidence: 'strong',
  rarity: 6,
  card_number: 1234,
  traits: [],
  highlights: [],
  runner_up_highlights: [],
  scores: {} as YirPersonaResponse['scores'],
  streak: { longest: 205, started_at: null },
  monthly: [],
};

const json = (payload: unknown, status: number) =>
  new Response(JSON.stringify(payload), { status });

describe('util: toYirPersonaAnswer', () => {
  it('should answer an open year with the mapped persona', async () => {
    const answer = await toYirPersonaAnswer(json(body, 200));

    expect(answer.isYearOpen).toBe(true);
    expect(answer.result?.persona).toBe('anime-voyager');
  });

  it('should answer a year that is not open yet without a persona', async () => {
    const answer = await toYirPersonaAnswer(
      json({ error: 'year_not_open' }, 403),
    );

    expect(answer).toEqual({ isYearOpen: false, result: null });
  });

  it('should keep the year open when the viewer is refused for being non-VIP', async () => {
    const answer = await toYirPersonaAnswer(
      json({ error: 'vip_required' }, 403),
    );

    expect(answer).toEqual({ isYearOpen: true, result: null });
  });

  it('should keep the year open when a refusal has no readable body', async () => {
    const answer = await toYirPersonaAnswer(
      new Response('nope', { status: 403 }),
    );

    expect(answer).toEqual({ isYearOpen: true, result: null });
  });

  it('should keep the year open when the persona is not found', async () => {
    const answer = await toYirPersonaAnswer(
      json({ error: 'year_not_open' }, 404),
    );

    expect(answer).toEqual({ isYearOpen: true, result: null });
  });
});
