import type { AvailableLanguage } from '$lib/features/i18n/index.ts';
import { describe, expect, it } from 'vitest';
import { toHumanCurrency } from './toHumanCurrency.ts';

describe('toHumanCurrency', () => {
  it('will display dollars', () => {
    const currencyParams = {
      price: 3.50,
      currency: 'usd',
      locale: 'en' as AvailableLanguage,
    };

    expect(toHumanCurrency(currencyParams)).toBe('$3.50');
  });

  it('will display euro', () => {
    const currencyParams = {
      price: 3.50,
      currency: 'eur',
      locale: 'en' as AvailableLanguage,
    };

    expect(toHumanCurrency(currencyParams)).toBe('€3.50');
  });

  it('will display dollars in a different locale', () => {
    const currencyParams = {
      price: 3.50,
      currency: 'usd',
      locale: 'nl' as AvailableLanguage,
    };

    expect(toHumanCurrency(currencyParams)).toBe('US$ 3,50');
  });

  it('will display euro in a different locale', () => {
    const currencyParams = {
      price: 3.50,
      currency: 'eur',
      locale: 'nl' as AvailableLanguage,
    };

    expect(toHumanCurrency(currencyParams)).toBe('€ 3,50');
  });

  it('will limit to max 2 decimals', () => {
    const currencyParams = {
      price: 6.789,
      currency: 'usd',
      locale: 'en' as AvailableLanguage,
    };

    expect(toHumanCurrency(currencyParams)).toBe('$6.79');
  });

  it('will omit decimals', () => {
    const currencyParams = {
      price: 6,
      currency: 'usd',
      locale: 'en' as AvailableLanguage,
    };

    expect(toHumanCurrency(currencyParams)).toBe('$6');
  });
});
