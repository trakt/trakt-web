import type { ErrorEvent as SentryErrorEvent } from '@sentry/sveltekit';
import { describe, expect, it } from 'vitest';
import { isBlockedEmbedEvent } from './isBlockedEmbedEvent.ts';

function playerError(detail: Record<string, unknown>): SentryErrorEvent {
  return {
    type: undefined,
    exception: {
      values: [
        {
          type: 'CustomEvent',
          value: 'Event `CustomEvent` (type=error) captured as exception',
        },
      ],
    },
    extra: {
      __serialized__: {
        currentTarget: '[Window]',
        detail,
        isTrusted: false,
        target: '[HTMLElement: div.plyr.plyr--youtube]',
        type: 'error',
      },
    },
  };
}

describe('util: isBlockedEmbedEvent', () => {
  it('should flag a trailer whose owner blocks embedding', () => {
    expect(
      isBlockedEmbedEvent(playerError({ code: 150, plyr: '[Object]' })),
    ).toBe(true);
    expect(
      isBlockedEmbedEvent(playerError({ code: 101, plyr: '[Object]' })),
    ).toBe(true);
  });

  it('should keep other player errors', () => {
    expect(
      isBlockedEmbedEvent(playerError({ code: 5, plyr: '[Object]' })),
    ).toBe(false);
    expect(
      isBlockedEmbedEvent(playerError({ code: 100, plyr: '[Object]' })),
    ).toBe(false);
  });

  it('should keep the same code when it does not come from the player', () => {
    expect(isBlockedEmbedEvent(playerError({ code: 150 }))).toBe(false);
  });

  it('should keep events without a serialized player error', () => {
    expect(
      isBlockedEmbedEvent({
        type: undefined,
        exception: { values: [{ type: 'TypeError', value: 'code 150' }] },
      }),
    ).toBe(false);
  });
});
