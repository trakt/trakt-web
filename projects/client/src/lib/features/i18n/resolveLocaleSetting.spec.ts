import { describe, expect, it } from 'vitest';
import { resolveLocaleSetting } from './resolveLocaleSetting.ts';

describe('util: resolveLocaleSetting', () => {
  it('should return the saved locale when it is valid and differs', () => {
    expect(resolveLocaleSetting({ saved: 'fr-FR', active: 'en-us' }))
      .to.equal('fr-FR');
  });

  it('should return null when nothing is saved', () => {
    expect(resolveLocaleSetting({ saved: null, active: 'en-us' }))
      .to.equal(null);
    expect(resolveLocaleSetting({ saved: undefined, active: 'en-us' }))
      .to.equal(null);
    expect(resolveLocaleSetting({ saved: '', active: 'en-us' }))
      .to.equal(null);
  });

  it('should return null when the saved locale is not available', () => {
    expect(resolveLocaleSetting({ saved: 'xx-XX', active: 'en-us' }))
      .to.equal(null);
  });

  it('should return null when the saved locale already matches', () => {
    expect(resolveLocaleSetting({ saved: 'fr-FR', active: 'fr-FR' }))
      .to.equal(null);
  });
});
