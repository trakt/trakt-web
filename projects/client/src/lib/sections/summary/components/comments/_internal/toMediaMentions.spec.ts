import { describe, expect, it } from 'vitest';
import { toMediaMentions } from './toMediaMentions.ts';

const member = (key: string, name: string, characterName: string) => ({
  key,
  name,
  characterName,
  headshot: { url: {} as never },
});

describe('util: toMediaMentions', () => {
  it('should link cast members to their absolute person page', () => {
    const [first] = toMediaMentions({
      cast: [member('steve-carell', 'Steve Carell', 'Michael Scott')],
    });

    expect(first).toEqual({
      name: 'Steve Carell',
      href: 'https://app.trakt.tv/people/steve-carell',
      detail: 'Michael Scott',
    });
  });

  it('should list a member once when they have several credits', () => {
    const result = toMediaMentions({
      cast: [
        member('jo-doe', 'Jo Doe', 'A'),
        member('jo-doe', 'Jo Doe', 'B'),
      ],
    });

    expect(result).toHaveLength(1);
  });

  it('should leave the detail out when there is no character name', () => {
    const [first] = toMediaMentions({ cast: [member('jo-doe', 'Jo Doe', '')] });

    expect(first?.detail).toBeUndefined();
  });
});
