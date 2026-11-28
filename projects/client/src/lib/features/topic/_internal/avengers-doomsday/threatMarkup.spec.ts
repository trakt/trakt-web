import { m } from '$lib/features/i18n/messages.ts';
import { describe, expect, it } from 'vitest';
import { threatMarkup } from './threatMarkup.ts';

const cellCount = (markup: string, pattern: RegExp) =>
  markup.match(pattern)?.length ?? 0;

describe('util: threatMarkup', () => {
  it('should always draw five cells', () => {
    expect(cellCount(threatMarkup(2), /<i[ >]/g)).toBe(5);
  });

  it.each([1, 3, 5])('should arm %i cells for that level', (level) => {
    expect(cellCount(threatMarkup(level), /class="is-armed"/g)).toBe(level);
  });

  it('should arm the leading cells first', () => {
    expect(threatMarkup(2)).toContain(
      '<i class="is-armed"></i><i class="is-armed"></i><i></i>',
    );
  });

  it('should label the level with the translated message', () => {
    expect(threatMarkup(4)).toContain(
      `<span class="doom-threat-level">${m.text_topic_doom_threat_level({ level: 4 })}</span>`,
    );
  });
});
