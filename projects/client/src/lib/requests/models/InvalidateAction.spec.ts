import { describe, expect, it } from 'vitest';
import { InvalidateAction } from './InvalidateAction.ts';

describe('InvalidateAction', () => {
  describe('Listed', () => {
    it('should keep movies on their own token', () => {
      expect(InvalidateAction.Listed('movie')).to.equal(
        'invalidate:listed:movie',
      );
    });

    it('should collapse seasons onto the show token', () => {
      expect(InvalidateAction.Listed('season')).to.equal(
        InvalidateAction.Listed('show'),
      );
    });

    it('should collapse episodes onto the show token', () => {
      expect(InvalidateAction.Listed('episode')).to.equal(
        InvalidateAction.Listed('show'),
      );
    });
  });
});
