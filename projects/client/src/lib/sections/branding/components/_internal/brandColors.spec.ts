import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { brandColors } from './brandColors.ts';

const PALETTE = readFileSync('src/style/palette/purple.css', 'utf8');

describe('brandColors', () => {
  it('should list the violet, white and ink colors as hex values', () => {
    expect(brandColors.map(({ key, hex }) => [key, hex])).toEqual([
      ['violet', '#6438D0'],
      ['white', '#FFFFFF'],
      ['ink', '#111111'],
    ]);
  });

  it('should stay in sync with the tokens in the palette', () => {
    const tokens = brandColors.flatMap(({ token }) => (token ? [token] : []));

    expect(tokens).not.toHaveLength(0);
    tokens.forEach(({ name, value }) => {
      expect(PALETTE).toContain(`${name}: ${value};`);
    });
  });
});
