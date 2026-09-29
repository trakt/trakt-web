import { describe, expect, it } from 'vitest';
import { personaFonts } from './personaFonts.ts';

describe('util: personaFonts', () => {
  it('should always include the base families', () => {
    const url = personaFonts(['critic']);

    expect(url).toContain('family=JetBrains+Mono');
    expect(url).toContain('family=Spline+Sans');
    expect(url).toMatch(/display=swap$/);
  });

  it('should include the runner-up families', () => {
    const url = personaFonts(['critic', 'opening-act']);

    expect(url).toContain('family=Playfair+Display');
    expect(url).toContain('family=Caveat');
  });

  it('should not repeat a family shared by two personas', () => {
    const url = personaFonts(['opening-night', 'opening-night']);

    expect(url.match(/Abril\+Fatface/g)).toHaveLength(1);
  });
});
