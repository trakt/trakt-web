import { describe, expect, it } from 'vitest';
import { parseTierPreview } from './parseTierPreview.ts';

describe('parseTierPreview', () => {
  it('should preview the free version when the tier is free', () => {
    expect(parseTierPreview(new URLSearchParams('tier=free'))).to.equal(true);
  });

  it('should not preview anything for other tiers', () => {
    expect(parseTierPreview(new URLSearchParams('tier=vip'))).to.equal(false);
    expect(parseTierPreview(new URLSearchParams())).to.equal(false);
  });
});
