/**
 * Tests for generateAndroidResourceFolder utility function
 */

import { describe, expect, it } from 'vitest';
import { generateAndroidResourceFolder } from './generateAndroidResourceFolder.ts';

describe('generateAndroidResourceFolder', () => {
  it('should return language-only folder for single locale per language', () => {
    expect(generateAndroidResourceFolder('es', ['es'])).toBe('values-es');
    expect(generateAndroidResourceFolder('es-es', ['es-es'])).toBe('values-es');
    expect(generateAndroidResourceFolder('it-it', ['it-it'])).toBe('values-it');
    expect(generateAndroidResourceFolder('ja-jp', ['ja-jp'])).toBe('values-ja');
    expect(generateAndroidResourceFolder('en-us', ['en-us'])).toBe('values-en');
  });

  it('should return region-specific folders when multiple locales exist for same language', () => {
    const multipleSpanishLocales = ['es-es', 'es-mx', 'en'];
    expect(generateAndroidResourceFolder('es-es', multipleSpanishLocales)).toBe(
      'values-es-ES',
    );
    expect(generateAndroidResourceFolder('es-mx', multipleSpanishLocales)).toBe(
      'values-es-MX',
    );

    const multipleFrenchLocales = ['fr-fr', 'fr-ca', 'en'];
    expect(generateAndroidResourceFolder('fr-fr', multipleFrenchLocales)).toBe(
      'values-fr-FR',
    );
    expect(generateAndroidResourceFolder('fr-ca', multipleFrenchLocales)).toBe(
      'values-fr-CA',
    );
  });

  it('should handle pure language codes correctly', () => {
    expect(generateAndroidResourceFolder('en', ['en', 'fr'])).toBe('values');
    expect(generateAndroidResourceFolder('fr', ['en', 'fr'])).toBe('values-fr');
  });

  it('should handle mixed single and multiple language scenarios', () => {
    const mixedLocales = ['en-us', 'en-gb', 'it-it', 'ja-jp'];
    // English has multiple locales, should use region-specific
    expect(generateAndroidResourceFolder('en-us', mixedLocales)).toBe(
      'values-en-US',
    );
    expect(generateAndroidResourceFolder('en-gb', mixedLocales)).toBe(
      'values-en-GB',
    );
    // Italian and Japanese have single locales, should use language-only
    expect(generateAndroidResourceFolder('it-it', mixedLocales)).toBe(
      'values-it',
    );
    expect(generateAndroidResourceFolder('ja-jp', mixedLocales)).toBe(
      'values-ja',
    );
  });

  it('should handle case insensitive locales', () => {
    expect(generateAndroidResourceFolder('ES-ES', ['ES-ES', 'ES-MX'])).toBe(
      'values-es-ES',
    );
    expect(generateAndroidResourceFolder('IT-IT', ['IT-IT'])).toBe('values-it');
  });

  it('should handle complex locale edge cases', () => {
    expect(generateAndroidResourceFolder('zh-hans-cn', ['zh-hans-cn'])).toBe(
      'values-zh-hans-cn',
    );
  });
});
