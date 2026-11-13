import { describe, expect, it } from 'vitest';
import { fadeAway } from './fadeAway.ts';

describe('transition: fadeAway', () => {
  it('should lift the block out of the flow while it fades', () => {
    const transition = fadeAway({} as HTMLElement);

    expect(transition.css?.(0, 1)).toBe(
      'position: absolute; inset-block-start: 0; inset-inline: 0; opacity: 0; pointer-events: none;',
    );
    expect(transition.css?.(1, 0)).toContain('opacity: 1;');
  });
});
