import { describe, expect, it } from 'vitest';
import { unwrapGradientPatterns } from './unwrapGradientPatterns.ts';

const gradient =
  '<linearGradient id="g1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#000"/></linearGradient>';
const rect = '<rect x="0" y="0" width="10" height="10" fill="url(#g1)"/>';

function withPattern(body: string): string {
  return `<svg><defs><pattern id="p1" x="0" y="0">${body}</pattern></defs>` +
    '<path fill="url(#p1)" d="M0,0"/></svg>';
}

describe('util: unwrapGradientPatterns', () => {
  describe('when a pattern holds a single gradient and rect', () => {
    const result = unwrapGradientPatterns(withPattern(`${gradient}${rect}`));

    it('should point the fill at the gradient', () => {
      expect(result).toContain('fill="url(#g1)" d="M0,0"');
    });

    it('should drop the pattern wrapper', () => {
      expect(result).not.toContain('<pattern');
    });

    it('should keep the gradient definition', () => {
      expect(result).toContain('<linearGradient id="g1"');
    });
  });

  describe('when a pattern holds more than one rect', () => {
    it('should leave it alone', () => {
      const svg = withPattern(`${gradient}${rect}${rect}`);

      expect(unwrapGradientPatterns(svg)).toBe(svg);
    });
  });

  describe('when a pattern holds no gradient', () => {
    it('should leave it alone', () => {
      const svg = withPattern(rect);

      expect(unwrapGradientPatterns(svg)).toBe(svg);
    });
  });

  describe('when there are no patterns', () => {
    it('should return the document untouched', () => {
      const svg = `<svg><defs>${gradient}</defs></svg>`;

      expect(unwrapGradientPatterns(svg)).toBe(svg);
    });
  });
});
