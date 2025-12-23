import { describe, expect, it } from 'vitest';
import type { NamedServiceOptions } from './models/NamedServiceOptions.ts';
import { sortStreamingCountries } from './sortStreamingCountries.ts';

describe('sortStreamingCountries', () => {
  const createServices = (
    country: string,
    countryName: string,
  ): NamedServiceOptions => ({
    country,
    countryName,
    services: [],
  });

  it('puts preferredCountry first', () => {
    const list = [
      createServices('de', 'Germany'),
      createServices('us', 'United States'),
      createServices('gb', 'United Kingdom'),
    ];
    const sorted = sortStreamingCountries(list, 'gb');
    expect(sorted.at(0)?.country).toBe('gb');
  });

  it('sorts by popularity then alphabetically', () => {
    const list = [
      createServices('de', 'Germany'),
      createServices('us', 'United States'),
      createServices('gb', 'United Kingdom'),
      createServices('fr', 'France'),
    ];
    const sorted = sortStreamingCountries(list, 'fr');
    const countries = sorted.map((entry) => entry.country);

    expect(countries).toEqual([
      'fr',
      'us',
      'gb',
      'de',
    ]);
  });

  it('sorts alphabetically', () => {
    const list = [
      createServices('bb', 'Barbados'),
      createServices('au', 'Australia'),
    ];
    const sorted = sortStreamingCountries(list, '');
    const countries = sorted.map((entry) => entry.country);

    expect(countries).toEqual([
      'au',
      'bb',
    ]);
  });
});
