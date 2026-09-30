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

  it('should load every family a persona card uses', () => {
    const url = personaFonts(['omnivore']);

    expect(url).toContain('family=Bricolage+Grotesque');
    expect(url).toContain('family=VT323');
  });

  it('should not repeat a family shared across two personas', () => {
    const url = personaFonts(['omnivore', 'comfort-rewatcher']);

    expect(url.match(/family=VT323/g)).toHaveLength(1);
  });
});
