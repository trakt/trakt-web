import { describe, expect, it } from 'vitest';
import { toPosterLanguage } from './toPosterLanguage.ts';

describe('util: toPosterLanguage', () => {
  it('should reduce a regional locale to its language', () => {
    expect(toPosterLanguage('pt-BR')).toBe('pt');
    expect(toPosterLanguage('fr-FR')).toBe('fr');
  });

  it('should keep a bare language code', () => {
    expect(toPosterLanguage('ja')).toBe('ja');
  });

  it('should return null for english locales', () => {
    expect(toPosterLanguage('en')).toBeNull();
    expect(toPosterLanguage('en-AU')).toBeNull();
  });
});
