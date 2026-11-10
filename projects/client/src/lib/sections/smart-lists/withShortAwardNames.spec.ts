import type { AwardCeremony } from '$lib/requests/models/AwardCeremony.ts';
import { describe, expect, it } from 'vitest';
import { withShortAwardNames } from './withShortAwardNames.ts';

const toCeremony = (names: string[]): AwardCeremony => ({
  slug: 'ceremony',
  name: 'Ceremony',
  mediaTypes: ['movie'],
  awards: names.map((name, index) => ({ slug: `award-${index}`, name })),
});

const toNames = (ceremony: AwardCeremony) =>
  ceremony.awards.map((award) => award.name);

describe('util: withShortAwardNames', () => {
  it('should drop the shared name up to and including for', () => {
    const ceremony = toCeremony([
      'Academy Award for Achievement in Casting',
      'Academy Award for Best Picture',
    ]);

    expect(toNames(withShortAwardNames(ceremony))).toEqual([
      'Achievement in Casting',
      'Best Picture',
    ]);
  });

  it('should keep the words shared after for', () => {
    const ceremony = toCeremony([
      'Primetime Emmy Award for Outstanding Drama Series',
      'Primetime Emmy Award for Outstanding Movie',
    ]);

    expect(toNames(withShortAwardNames(ceremony))).toEqual([
      'Outstanding Drama Series',
      'Outstanding Movie',
    ]);
  });

  it('should keep the name of a single award', () => {
    const ceremony = toCeremony(["Palme d'Or"]);

    expect(withShortAwardNames(ceremony)).toEqual(ceremony);
  });

  it('should keep the names when they share no for', () => {
    const ceremony = toCeremony(['Golden Lion', 'Golden Bear']);

    expect(withShortAwardNames(ceremony)).toEqual(ceremony);
  });
});
