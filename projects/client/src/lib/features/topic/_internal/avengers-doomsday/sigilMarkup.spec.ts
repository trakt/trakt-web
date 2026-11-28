import { describe, expect, it } from 'vitest';
import { sigilMarkup } from './sigilMarkup.ts';

const layerNames = (markup: string) =>
  [...markup.matchAll(/data-layer="([^"]+)"/g)].map((match) => match[1]);

describe('util: sigilMarkup', () => {
  it('should repeat the same markup for the same seed', () => {
    expect(sigilMarkup({ seed: 1218 })).toBe(sigilMarkup({ seed: 1218 }));
  });

  it('should draw different glyphs for different seeds', () => {
    expect(sigilMarkup({ seed: 1218 })).not.toBe(sigilMarkup({ seed: 1812 }));
  });

  it('should default to the full variant with four layers', () => {
    const markup = sigilMarkup();

    expect(markup).toContain('data-variant="full"');
    expect(layerNames(markup)).toEqual(['outer', 'glyphs', 'star', 'core']);
  });

  it('should draw two layers for the ring variant', () => {
    const markup = sigilMarkup({ variant: 'ring' });

    expect(markup).toContain('data-variant="ring"');
    expect(layerNames(markup)).toEqual(['outer', 'glyphs']);
  });

  it('should wrap the layers in a single sigil span', () => {
    const markup = sigilMarkup({ variant: 'ring' });

    expect(markup.startsWith('<span class="doom-sigil"')).toBe(true);
    expect(markup.endsWith('</span>')).toBe(true);
  });
});
